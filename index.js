import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import { getMembersBySlug, getTeamsByOrg, getReposBySlug, getPullsByRepo, getReviewsByPullNum } from './wrappers/GitHub.js'

// Defining default variable values

const teams = [];
const members = new Map();
const repos = new Map();
const ghPulls = new Map();
const ORG = process.env.GITHUB_ORG;

// Setting up Lowdb

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Execution functions

function buildTeams() {
    Promise.all([getTeamsByOrg(ORG)])
        .then( (res) => {
            res[0].data.forEach( (team) => {
                teams.push({ 
                    name: team.name,
                    slug: team.slug,
                    id: team.id,
                    members: [],
                    repos: []
                });
            })
        })
        .catch( (err) => {
            console.log(err);
        });
};

function writeTeams() {
    db.data = db.data || { ghTeams: [], learners: [], lookup: [] }
    teams.forEach( (team) => {
        db.data
        .ghTeams
        .push(team)
        db.write()
    });
};

async function buildMembers() {
    await db.read()
    db.data.ghTeams.forEach( (team) => {
        Promise.all([getMembersBySlug(ORG, team.slug)])
            .then( (res) => {
                members.set(team.name, res[0].data.map( (member) => member.login));
            })
            .catch( (err) => {
                console.log(err);
            });
    });
}; 

async function writeMembers() {
    await db.read()
    db.data
    .ghTeams.forEach( (team) => {
        team.members.push(...members.get(team.name));
    });
    db.write()
};

async function buildRepos() {
    await db.read()
    db.data.ghTeams.forEach( (team) => {
        Promise.all([getReposBySlug(ORG, team.slug)])
            .then( (res) => {
                repos.set(team.name, res[0].data.map( (repo) => repo.name));
            })
            .catch( (err) => {
                console.log(err);
            });
    });
}; 

async function writeRepos() {
    await db.read()
    db.data
    .ghTeams.forEach( (team) => {
        team.repos.push(...repos.get(team.name));
    });
    db.write()
};

async function buildLearners() {
    await db.read()
    members.forEach( (value, key) => {
        value.forEach( (learner) => {
            if (learner !== "tinomen" && learner !== "ryan-hamblin" && learner !== "nlittlepoole" && learner !== "TashaSkyUp" && learner !== "frankfusco" && learner !== "ike-okonkwo" && learner !== "johnnydhicks" && learner !== "derekjpeters" && learner !== 'ashtilawat23' && learner !== "BrokenShell" && learner !== "paulstgermain" && learner !== "bummings" && learner !== "cyreallen" && learner !== "jinjahninjah") {
                db.data.learners.push({
                    login: learner,
                    team: key,
                    repos: [...repos.get(key)],
                    pulls: [],
                    prsSubmitted: 0,
                    prsMerged: 0,
                    comments: 0,
                    reviews: 0,
                    avgCommentLen: 0,
                });
                db.data.lookup.push(learner);
            };
        });
    });
    db.write()
};

async function appendPulls() {
    await db.read()
    repos.forEach((value) => {
        value.forEach((repo) => {
            Promise.all([getPullsByRepo(ORG, repo)])
                .then((res) => {
                    res[0].data.forEach((pull) => {
                        if (db.data.lookup.includes(pull.user.login)) {
                            db.data.learners[db.data.lookup.indexOf(pull.user.login)].pulls.push([repo, pull.number]);
                            db.data.learners[db.data.lookup.indexOf(pull.user.login)].prsSubmitted += 1;
                            if (pull.merged_at !== null) {
                                db.data.learners[db.data.lookup.indexOf(pull.user.login)].prsMerged += 1;
                            }
                            db.write()
                        };
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
};

async function buildPulls() {
    await db.read()
    db.data.learners.forEach((learner) => {
        learner.pulls.forEach((pull) => {
            if (ghPulls.has(pull[0])) {
                const temp = ghPulls.get(pull[0]);
                ghPulls.set(pull[0], [...temp, pull[1]]);
            }
            else {
                ghPulls.set(pull[0], [pull[1]]);
            };
        });
    });
};

async function appendReviews() {
    await db.read()
    ghPulls.forEach((value, key) => {
        value.forEach((pullNum) => {
            Promise.all([getReviewsByPullNum(ORG, key, pullNum)])
                .then((res) => {
                    if (res[0].data.length > 0) {
                        res[0].data.forEach((review) => {
                            if (db.data.lookup.includes(review.user.login)) {
                                db.data.learners[db.data.lookup.indexOf(review.user.login)].reviews += 1;
                                db.write()
                            };
                        });
                    };
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
};

// Executing functions

// setTimeout(() => {
//     buildTeams();
// }, 1000);

// setTimeout(() => {
//     writeTeams();
// }, 3000);

// setTimeout(() => {
//     buildMembers();
// }, 5000)

// setTimeout(() => {
//     writeMembers();
// }, 7000);

// setTimeout(() => {
//     buildRepos();
// }, 9000);

// setTimeout(() => {
//     writeRepos();
// }, 11000);

// setTimeout(() => {
//     buildLearners();
// }, 13000)

// setTimeout(() => {
//     appendPulls();
// }, 15000);

// setTimeout(() => {
//     buildPulls();
// }, 17000);

// setTimeout(() => {
//     appendReviews();
// }, 19000);

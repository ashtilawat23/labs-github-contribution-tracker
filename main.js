import 'dotenv/config'

// Lowdb imports
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

// GH API helper functions
import { 
    getMembersBySlug, 
    getTeamsByOrg, 
    getReposBySlug, 
    getPullsByRepo, 
    getReviewsByPullNum, 
    getCommitsByPullNum 
} from './wrappers/GitHub.js'

// Setting up Lowdb
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db/database.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// key variables
import { staff, staffTeams } from './db/staff.js'
const org = process.env.GITHUB_ORG;

function setDefaults() {
    db.data = { teamSlugs: [], repos: [], learners: [] }
    db.write()
}

async function writeTeams() {
    await db.read()
    Promise.all([getTeamsByOrg(org)])
        .then( (res) => {
            res[0].data.forEach((team) => {
                if (!staffTeams.includes(team.slug)) {
                    db.data.teamSlugs.push(team.slug)
                    db.write()
                };
            });
        });
};

async function writeRepos() {
    await db.read()
    db.data.teamSlugs.forEach( (slug) => {
        Promise.all([getReposBySlug(org, slug)])
            .then ( (res) => {
                res[0].data.forEach((repo) => {
                    db.data.repos.push({
                        name: repo.name,
                        pulls: []
                    })
                    db.write()
                });
            });
    });
};

async function writeLearners() {
    await db.read()
    db.data.teamSlugs.forEach( (slug) => {
        Promise.all([getMembersBySlug(org, slug)])
            .then( (res) => {
                res[0].data.forEach( (member) => {
                    if (!staff.includes(member.login)) {
                        db.data.learners.push({
                            login: member.login,
                            id: member.id,
                            avatar: member.avatar_url,
                            prNums: [],
                            prsSubmitted: 0,
                            prsMerged: 0,
                            reviews: 0
                        });
                        db.write()
                    };
                });
            });
    });
};

async function writePulls() {
    await db.read()
    db.data.repos.forEach((repo) => {
        Promise.all([getPullsByRepo(org, repo.name)])
            .then( (res) => {
                res[0].data.forEach((pull) => {
                    repo.pulls.push({
                        number: pull.number,
                        mergedAt: pull.merged_at,
                        authors: [pull.user.login],
                        commits_url: [],
                        reviews: []
                    });
                    db.write()
                });
            });
    });
};


const executionArr = [
    setDefaults, 
    writeTeams, 
    writeRepos, 
    writeLearners, 
    writePulls
];
for (let i=0; i<executionArr.length; i++) {
    setTimeout(executionArr[i], i*3000);
};

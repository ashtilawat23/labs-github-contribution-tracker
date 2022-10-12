import 'dotenv/config'

// Lowdb imports
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

// GH API helper functions
import { 
    getTeamsByOrg,
    getReposBySlug,
    getCommitsByRepo
} from './wrappers/GitHub.js'

// Setting up Lowdb
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db/commits.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// key variables
import { staff, staffTeams } from './db/staff.js'
const org = process.env.GITHUB_ORG;

function setDefaults() {
    db.data = { teamSlugs: [], repos: [], commits: [] }
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
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

async function writeRepos() {
    await db.read()
    db.data.teamSlugs.forEach( (slug) => {
        Promise.all([getReposBySlug(org, slug)])
            .then ( (res) => {
                res[0].data.forEach((repo) => {
                    db.data.repos.push(repo.name)
                    db.write()
                });
            });
    });
};

async function writeCommits() {
    await db.read()
    db.data.repos.forEach( (repo) => {
        Promise.all([getCommitsByRepo(org, repo)])
            .then ( (res) => {
                res[0].data.forEach((c) => {
                    db.data.commits.push({
                        sha: c.sha,
                        commiter: c.commit.committer.name,
                        repo: repo,
                        date: c.commit.committer.date
                    })
                    db.write()
                });
            })
            .catch((err) => {
                console.log(err);
            })
    });
};

const executionArr = [
    setDefaults,
    writeTeams,
    writeRepos,
    writeCommits
];

export function writeDb() {
    for (let i=0; i<executionArr.length; i++) {
        setTimeout(executionArr[i], i*3000);
    };
};
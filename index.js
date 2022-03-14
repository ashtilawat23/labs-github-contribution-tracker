import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import { getMembersBySlug, getTeamsByOrg } from './wrappers/GitHub.js'

// Defining default variable values

const teams = [];
const members = new Map();
const ORG = process.env.GITHUB_ORG;

// Setting up Lowdb

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Execution functions

function buildTeams(ORG) {
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
    db.data = db.data || { ghTeams: [] }
    teams.forEach( (team) => {
        db.data
        .ghTeams
        .push(team)
        db.write()
    });
};

async function buildMembers(ORG) {
    await db.read()
    db.data.ghTeams.forEach( (team) => {
        Promise.all([getMembersBySlug(ORG, team.slug)])
            .then( (res) => {
                members.set(team.name, res[0].data);
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
        team.members.push(members.get(team.name));
    });
    db.write()
};

// Executing functions

setTimeout(() => {
    buildTeams(ORG);
}, 3000);

setTimeout(() => {
    writeTeams();
}, 5000);

setTimeout(() => {
    buildMembers(ORG);
}, 7000)

setTimeout(() => {
    writeMembers();
}, 9000);




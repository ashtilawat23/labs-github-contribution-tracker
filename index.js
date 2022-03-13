import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import { getTeamsByOrg } from './wrappers/GitHub.js'

const teams = [];

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
// await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = db.data || { posts: [] } 

// You can also use this syntax if you prefer
// const { posts } = db.data
// posts.push('hello world')

// Write db.data content to db.json
// await db.write()

Promise.all([getTeamsByOrg(process.env.GITHUB_ORG)])
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

const writeTeams = () => {
    db.data = db.data || { ghTeams: [] }
    teams.forEach( (team) => {
        db.data
        .ghTeams
        .push(team)
        db.write()
    });
};

setTimeout(() => {
    writeTeams();
}, 5000);
import express from 'express'
import { Low, JSONFile } from 'lowdb'

const app = express()
app.use(express.json())

const adapter = new JSONFile('db/commits.json')
const db = new Low(adapter)
await db.read()

app.get('/repos', async (req, res) => { 
  const { repos } = db.data
  res.send(repos)
})

app.get('/commits', async (req, res) => { 
    const { commits } = db.data
    res.send(commits)
})

app.get('/teams', async (req, res) => { 
    const { teamSlugs } = db.data
    res.send(teamSlugs)
})

app.listen(8000, () => {
  console.log('listening on port 8000')
})
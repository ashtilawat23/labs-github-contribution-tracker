// Lowdb imports
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

// Setting up Lowdb
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db/commits.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()

export async function fetchRepos() {
    const { repos } = db.data
    return repos
}
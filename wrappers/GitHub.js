import 'dotenv/config'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
    auth: process.env.PERSONAL_GITHUB_ACCESS_TOKEN,
});

async function getTeamsByOrg(ORG) {
    try {
        const response = octokit.rest.teams
        .list({
            org: ORG
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get teams: ${error}`);
    };

};



export { getTeamsByOrg };
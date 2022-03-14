import 'dotenv/config'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
    auth: process.env.PERSONAL_GITHUB_ACCESS_TOKEN,
});

async function getTeamsByOrg(ORG) {
    try {
        const response = await octokit.rest.teams
        .list({
            org: ORG
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get teams: ${error}`);
    };

};

async function getMembersBySlug(ORG, SLUG) {
    try {
        const reponse = await octokit.rest.teams
        .listMembersInOrg({
            org: ORG,
            team_slug: SLUG
        });
        return reponse;
    } 
    catch(error) {
        console.log(`Could not get members: $(error)`);
    };
};

async function getReposBySlug(ORG, SLUG) {
    try {
        const reponse = await octokit.rest.teams
        .listReposInOrg({
            org: ORG,
            team_slug: SLUG
        });
        return reponse;
    } 
    catch(error) {
        console.log(`Could not get repos: $(error)`);
    };
};

export { getTeamsByOrg, getMembersBySlug, getReposBySlug };
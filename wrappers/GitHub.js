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
        const response = await octokit.rest.teams
        .listMembersInOrg({
            org: ORG,
            team_slug: SLUG,
            per_page: '100'
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get members: ${error}`);
    };
};

async function getReposBySlug(ORG, SLUG) {
    try {
        const response = await octokit.rest.teams
        .listReposInOrg({
            org: ORG,
            team_slug: SLUG
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get repos: ${error}`);
    };
};

async function getPullsByRepo(ORG, REPO) {
    try {
        const response = await octokit.rest.pulls
        .list({
            owner: ORG,
            repo: REPO,
            sort: 'created',
            state: 'closed',
            direction: 'desc',
            per_page: '100'
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get pulls: ${error}`);
    };
};

async function getReviewsByPullNum(ORG, REPO, PULLNUM) {
    try {
        const response = await octokit.rest.pulls
        .listReviews({
            owner: ORG,
            repo: REPO,
            pull_number: PULLNUM
        });
        return response;
    } 
    catch(error) {
        console.log(`Could not get reviews: ${error}`);
    };
};

export { getTeamsByOrg, getMembersBySlug, getReposBySlug, getPullsByRepo, getReviewsByPullNum };
require('dotenv').config()
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
    auth: process.env.PERSONAL_GITHUB_ACCESS_TOKEN,
});

export const getCommitsByRepo = (org, ghRepo) => {
    octokit.repos.listCommits({
        owner: org,
        repo: ghRepo,
        state: 'all'
    })
    .then( (res) => {
        console.log(res.data);
    })
    .catch( (err) => {
        console.log(err);
    });
}

export const getPullRequestsByRepo = (org, ghRepo) => {
    octokit.rest.pulls.list({
        owner: org,
        repo: ghRepo,
    })
    .then( (res) => {
        console.log(res.data);
    })
    .catch( (err) => {
        console.log(err);
    });
}

export const getTeamsByRepo = (org) => {
    octokit.rest.teams.list({
        org: org
    })
    .then( (res) => {
        console.log(res.data);
    })
    .catch( (err) => {
        console.log(err);
    })
}

export const getMembersByTeam = (org, slug) => {
    octokit.rest.teams.listMembersInOrg({
        org: org,
        team_slug: slug
    })
    .then( (res) => {
        console.log(res.data);
    })
    .catch( (err) => {
        console.log(err)
    })
}
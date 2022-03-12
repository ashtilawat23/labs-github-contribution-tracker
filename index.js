import { getCommitsByRepo, getMembersByTeam, getPullRequestsByRepo, getTeamsByRepo } from "./wrappers/GitHub"

const org = process.env.GITHUB_ORG;
const ghRepo = "family-promise-case-mgmt-fe";
const slug = 'family-promise-case-mgmt'

getMembersByTeam(org,slug);
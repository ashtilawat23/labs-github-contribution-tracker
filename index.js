import { getCommitsByRepo, getPullRequestsByRepo } from "./wrappers/GitHub"

const org = process.env.GITHUB_ORG;
const ghRepo = "family-promise-case-mgmt-fe";

getPullRequestsByRepo(org, ghRepo)
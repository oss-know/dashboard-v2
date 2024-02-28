import {request} from '@umijs/max';


export async function getRepoCommits(owner: string, repo: string, options?: { [key: string]: any }) {
  return request<API.RepoCommit[]>(`/api/contrib/${owner}/${repo}/commit_history`, {
    method: 'GET',
    ...(options || {}),
  }).then(rawCommits => {
    return rawCommits.map(rawCommit => {
      return {
        date: new Date(rawCommit.date),
        commits: rawCommit.commits
      }
    })
  })
}


export async function getRepoReleases(owner: string, repo: string, options?: { [key: string]: any }) {
  return request<API.RepoRelease[]>(`/api/contrib/${owner}/${repo}/release_history`, {
    method: 'GET',
    ...(options || {}),
  }).then(rawRels => {
    return rawRels.map(rawRel => {
      return {
        date: new Date(rawRel.date),
        releases: rawRel.releases,
      }
    })
  })
}

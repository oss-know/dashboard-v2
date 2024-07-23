// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get region social influence GET /api/influence/region/social */
export async function projectRegionSocialInfluence(
  ownerRepos: { owner: string; repo: string }[],
  options?: { [key: string]: any },
) {
  return request('/api/influence/region/social', {
    method: 'POST',
    data: ownerRepos,
    ...(options || {}),
  });
}

/** Generate social influence pivot table GET /api/influence/region/social/pivot_table */
export async function projectRegionSocialInfluencePivotTable(
  ownerRepos: { owner: string; repo: string }[],
  options?: { [key: string]: any },
) {
  return request('/api/influence/region/social/pivot_table', {
    method: 'POST',
    data: ownerRepos,
    ...(options || { getResponse: true }),
  });
}

/** Download a file */
// TODO Should be put to a package as general API
export async function downloadPivotTable(url: string, options?: { [key: string]: any }) {
  return request(url, {
    method: 'GET',
    ...(options || { responseType: 'blob', parseResponse: false }),
  });
}

/** Get projects that have region social influence status GET /api/influence/region/social/projects */
export async function listRegionSocialInfluenceProjects(options?: { [key: string]: any }) {
  return request<API.OwnerRepo[]>('/api/influence/region/social/projects', {
    method: 'GET',
    ...(options || {}),
  });
}

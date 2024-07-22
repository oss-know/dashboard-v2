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

/** Get projects that have region social influence status GET /api/influence/region/social/projects */
export async function listRegionSocialInfluenceProjects(options?: { [key: string]: any }) {
  return request<API.OwnerRepo[]>('/api/influence/region/social/projects', {
    method: 'GET',
    ...(options || {}),
  });
}

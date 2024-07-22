declare namespace API {
  // type RepoCommitsParams = {
  //   owner?: string,
  //   repo?: stirng,
  // }

  type RepoCommit = {
    date?: string;
    commits?: number;
  };

  type RepoRelease = {
    date?: string;
    releases?: number;
  };

  type OwnerRepo = {
    owner: string;
    repo: string;
  };
}

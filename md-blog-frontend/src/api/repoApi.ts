const BASE_URL = "http://localhost:8080";

export interface ConnectedRepo {
  githubRepoId: number;
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  pushedAt: string;
  blog: boolean;
}

export interface GithubRepo {
  githubRepoId: number;
  ownerGithubId: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  htmlUrl: string;
  defaultBranch: string;
}

export async function getPublicRepos(token: string): Promise<GithubRepo[]> {
  const res = await fetch(`${BASE_URL}/api/repos/public`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

export async function getConnectedRepos(token: string): Promise<ConnectedRepo[]> {
  const res = await fetch(`${BASE_URL}/api/repos/connected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch connected repos");
  return res.json();
}

export async function connectRepos(token: string, repos: GithubRepo[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/repos/connect`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repos }),
  });
  if (!res.ok) throw new Error("Failed to connect repos");
}

export async function disconnectRepos(token: string, githubRepoIds: number[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/repos/disconnect`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ githubRepoIds }),
  });
  if (!res.ok) throw new Error("Failed to disconnect repos");
}

export async function addBlogRepos(token: string, githubRepoIds: number[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/blog/repos/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ githubRepoIds }),
  });
  if (!res.ok) throw new Error("Failed to add blog repos");
}

export async function removeBlogRepos(token: string, githubRepoIds: number[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/blog/repos/remove`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ githubRepoIds }),
  });
  if (!res.ok) throw new Error("Failed to remove blog repos");
}

export interface TodayFileChange {
  filePath: string;
  changeType: "added" | "modified" | "deleted";
  commitMessage: string;
  additions: number;
  deletions: number;
  time: string;
}

export interface TodayUpdateRepo {
  repoName: string;
  language: string | null;
  totalAdd: number;
  totalDel: number;
  files: TodayFileChange[];
}

export async function getTodayUpdates(token: string): Promise<TodayUpdateRepo[]> {
  const res = await fetch(`${BASE_URL}/api/repos/today-updates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch today updates");
  return res.json();
}

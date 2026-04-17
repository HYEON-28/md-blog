const BASE_URL = "http://localhost:8080";

export interface ConnectedRepo {
  githubRepoId: number;
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  pushedAt: string;
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

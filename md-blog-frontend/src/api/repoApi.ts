const BASE_URL = "http://localhost:8080";

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export async function getPublicRepos(token: string): Promise<GithubRepo[]> {
  const res = await fetch(`${BASE_URL}/api/repos/public`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

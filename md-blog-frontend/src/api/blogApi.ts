const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface BlogRepo {
  githubRepoId: number;
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  readme: string | null;
}

export interface BlogMain {
  username: string;
  name: string | null;
  avatarUrl: string | null;
  repos: BlogRepo[];
}

export async function getBlogMain(username: string): Promise<BlogMain> {
  const res = await fetch(`${API_BASE_URL}/api/blog/${username}`);
  if (res.status === 404) throw new Error("User not found");
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
}

export interface FileTreeNode {
  type: "file" | "folder";
  name: string;
  path: string | null;
  children: FileTreeNode[] | null;
}

export interface BlogFileTreeRepo {
  repoName: string;
  repoFullName: string;
  children: FileTreeNode[];
}

export async function getBlogFileTree(username: string): Promise<BlogFileTreeRepo[]> {
  const res = await fetch(`${API_BASE_URL}/api/blog/${username}/file-tree`);
  if (!res.ok) throw new Error("Failed to fetch file tree");
  return res.json();
}

export interface BlogFileContent {
  path: string;
  content: string;
}

export async function getBlogFileContent(
  username: string,
  repoFullName: string,
  path: string
): Promise<BlogFileContent> {
  const params = new URLSearchParams({ repoFullName, path });
  const res = await fetch(`${API_BASE_URL}/api/blog/${username}/file-content?${params}`);
  if (!res.ok) throw new Error("Failed to fetch file content");
  return res.json();
}

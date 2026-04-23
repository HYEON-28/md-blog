import { useEffect, useState } from "react";
import { getBlogMain, type BlogMain } from "../api/blogApi";

interface Props {
  username: string;
}

export default function BlogMain({ username }: Props) {
  const [blog, setBlog] = useState<BlogMain | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBlogMain(username)
      .then(setBlog)
      .catch((e: Error) => {
        if (e.message === "User not found") setNotFound(true);
        else setError(true);
      });
  }, [username]);

  if (error) {
    return <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>;
  }

  if (notFound) {
    return (
      <div>
        <h1>404</h1>
        <p>존재하지 않는 블로그입니다.</p>
      </div>
    );
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {blog.avatarUrl && (
        <img src={blog.avatarUrl} alt={blog.username} width={80} height={80} />
      )}
      <h1>Hello, {blog.username}</h1>
      {blog.name && <p>{blog.name}</p>}
    </div>
  );
}

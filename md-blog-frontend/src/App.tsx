import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthCallback from "./pages/AuthCallback";
import RepoLink from "./pages/RepoLink";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Main from "./pages/Main";
import RepoSettings from "./pages/RepoSettings";
import BlogSettings from "./pages/BlogSettings";

function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const getRootElement = () => {
    if (!isLoggedIn) return <Landing />;
    return <Navigate to="/main" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={getRootElement()} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/repolink" element={<RepoLink />} />
      <Route path="/main" element={<Main />} />
      <Route path="/repoSettings" element={<RepoSettings />} />
      <Route path="/blogSettings" element={<BlogSettings />} />
    </Routes>
  );
}

export default App;

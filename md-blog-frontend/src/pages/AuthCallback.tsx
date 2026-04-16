import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasLinkedRepo } from "../api/authApi";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login?error=true", { replace: true });
      return;
    }
    login(token)
      .then(() => hasLinkedRepo(token))
      .then((linked) => navigate(linked ? "/main" : "/gitlink", { replace: true }))
      .catch(() => navigate("/login?error=true", { replace: true }));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}

export default AuthCallback;

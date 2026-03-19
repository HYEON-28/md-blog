import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// TODO: import { useAuth } from '../context/AuthContext' once backend is connected

type Status = 'loading' | 'error';

/**
 * Handles the GitHub OAuth redirect callback.
 * Extracts the `code` query parameter and exchanges it for an access token
 * via the backend API (placeholder until backend is connected).
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setErrorMessage(`GitHub 인증 거부됨: ${error}`);
      setStatus('error');
      return;
    }

    if (!code) {
      setErrorMessage('인증 코드가 없습니다.');
      setStatus('error');
      return;
    }

    exchangeCodeForToken(code);
  }, []);

  /**
   * Exchanges the OAuth code for an access token via the backend.
   * TODO: replace the placeholder URL with the actual backend endpoint.
   */
  async function exchangeCodeForToken(code: string) {
    try {
      // TODO: connect to backend endpoint, e.g. POST /api/auth/github/callback
      // const res = await fetch('/api/auth/github/callback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code }),
      // });
      // const { token } = await res.json();
      // const { login } = useAuth();  // call at component top-level when uncommenting
      // login(token);
      // navigate('/');

      // Placeholder: log code until backend is ready
      console.log('OAuth code received:', code);
      alert(`OAuth code received (백엔드 미연결):\n${code}`);
      navigate('/');
    } catch (err) {
      setErrorMessage('토큰 교환 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }

  if (status === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.errorText}>{errorMessage}</p>
          <button style={styles.button} onClick={() => navigate('/')}>
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.loadingText}>GitHub 인증 처리 중...</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0d1117',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '48px 40px',
    backgroundColor: '#161b22',
    borderRadius: 12,
    border: '1px solid #30363d',
    minWidth: 320,
    textAlign: 'center',
  },
  loadingText: {
    color: '#8b949e',
    fontSize: 15,
    margin: 0,
  },
  errorText: {
    color: '#f85149',
    fontSize: 15,
    margin: 0,
  },
  button: {
    padding: '10px 24px',
    backgroundColor: '#21262d',
    color: '#e6edf3',
    border: '1px solid #30363d',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
  },
};

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string;

const GITHUB_AUTHORIZE_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user`;

/**
 * Renders the GitHub OAuth login page.
 * Redirects the user to GitHub's authorization endpoint on button click.
 */
export default function LoginPage() {
  function handleLogin() {
    window.location.href = GITHUB_AUTHORIZE_URL;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MD Blog</h1>
        <p style={styles.subtitle}>GitHub 저장소의 마크다운 파일을 블로그로</p>
        <button style={styles.button} onClick={handleLogin}>
          <GitHubIcon />
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ marginRight: 8, verticalAlign: 'middle' }}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
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
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    minWidth: 320,
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    color: '#e6edf3',
    letterSpacing: -1,
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#8b949e',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: '10px 24px',
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.15s',
  },
};

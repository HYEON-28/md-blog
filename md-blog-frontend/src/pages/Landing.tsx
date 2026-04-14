import "../styles/Landing.css";

function Landing() {
  return (
    <>
      {/* LANG BAR */}
      <div className="lang-bar">
        <span className="lang-bar-label">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Language
        </span>
        <button className="lang-btn active" data-lang="ko">
          🇰🇷 한국어
        </button>
        <button className="lang-btn" data-lang="en">
          🇺🇸 English
        </button>
        <button className="lang-btn" data-lang="ja">
          🇯🇵 日本語
        </button>
        <button className="lang-btn" data-lang="zh">
          🇨🇳 中文
        </button>
      </div>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            />
          </svg>
          <span className="wordmark">
            Git<span className="nav-logo-accent">Blog</span>
          </span>
        </a>
        <div className="nav-actions">
          <a href="#" className="btn btn-ghost" data-i18n="nav_login">
            로그인
          </a>
          <a href="#" className="btn btn-green" data-i18n="nav_signup">
            회원가입
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span data-i18n="hero_badge">
            GitHub 레포를 블로그로 바꾸는 가장 쉬운 방법
          </span>
        </div>
        <h1 data-i18n-html="hero_h1">
          GitHub 레포를
          <br />
          <span className="highlight">블로그처럼</span> 관리하세요
        </h1>
        <p className="hero-desc" data-i18n-html="hero_desc">
          로그인하고 레포를 연결하세요.
          <br />
          오늘 수정한 내용을 자동으로 요약하고,
          <br />
          다양한 언어로 번역해 전 세계와 공유합니다.
        </p>
        <div className="hero-cta">
          <a href="#" className="btn-hero-green">
            <svg width="16" height="16" viewBox="0 0 98 96" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              />
            </svg>
            <span data-i18n="hero_cta_primary">GitHub로 시작하기</span>
          </a>
          <a href="#features" className="btn-hero-outline">
            <span data-i18n="hero_cta_secondary">기능 살펴보기</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-label" data-i18n="feat_label">
          Features
        </p>
        <h2 className="section-title" data-i18n="feat_title">
          레포 하나로 블로그 그 이상
        </h2>
        <p className="section-sub" data-i18n="feat_sub">
          commit 히스토리가 곧 콘텐츠가 됩니다
        </p>
        <div className="features-grid">
          <div className="feature-card" style={{ animationDelay: "0s" }}>
            <div className="feature-icon">📝</div>
            <div className="feature-title" data-i18n="f1_title">
              오늘 수정한 내용 모아보기
            </div>
            <div className="feature-desc" data-i18n="f1_desc">
              하루 동안 변경된 파일과 커밋을 자동으로 수집해 한눈에 보여줍니다.
              무엇이 바뀌었는지 빠르게 파악하세요.
            </div>
          </div>
          <div className="feature-card" style={{ animationDelay: "0.1s" }}>
            <div className="feature-icon">✨</div>
            <div className="feature-title" data-i18n="f2_title">
              AI 요약 정리
            </div>
            <div className="feature-desc" data-i18n="f2_desc">
              오늘 수정한 내용을 AI가 자동으로 읽기 좋은 요약본으로 변환합니다.
              복잡한 diff도 단숨에 이해할 수 있습니다.
            </div>
          </div>
          <div className="feature-card" style={{ animationDelay: "0.2s" }}>
            <div className="feature-icon">🌐</div>
            <div className="feature-title" data-i18n="f3_title">
              다국어 번역
            </div>
            <div className="feature-desc" data-i18n="f3_desc">
              한국어, 일본어, 영어, 중국어 — 원하는 언어로 자동 번역해 전 세계
              개발자와 아이디어를 공유하세요.
            </div>
          </div>
          <div className="feature-card" style={{ animationDelay: "0.3s" }}>
            <div className="feature-icon">🐦</div>
            <div className="feature-title" data-i18n="f4_title">
              트위터 공유
            </div>
            <div className="feature-desc" data-i18n="f4_desc">
              요약본을 바로 트위터에 공유하세요. 내가 만든 것을 세상에 알리고 더
              많은 피드백을 받을 수 있습니다.
            </div>
          </div>
          <div className="feature-card" style={{ animationDelay: "0.4s" }}>
            <div className="feature-icon">🔗</div>
            <div className="feature-title" data-i18n="f5_title">
              GitHub 완전 연동
            </div>
            <div className="feature-desc" data-i18n="f5_desc">
              GitHub OAuth로 1분 안에 연결. 레포를 선택하면 나머지는 자동입니다.
              별도 설정이 필요 없습니다.
            </div>
          </div>
          <div className="feature-card" style={{ animationDelay: "0.5s" }}>
            <div className="feature-icon">📅</div>
            <div className="feature-title" data-i18n="f6_title">
              히스토리 아카이브
            </div>
            <div className="feature-desc" data-i18n="f6_desc">
              날짜별 요약이 자동으로 쌓입니다. 지난 날의 작업 기록을 블로그
              포스트처럼 언제든 다시 찾아볼 수 있습니다.
            </div>
          </div>
        </div>
      </section>

      {/* DEMO PANEL */}
      <section className="demo-section">
        <div className="demo-inner">
          <div className="demo-text">
            <h2 data-i18n-html="demo_h2">
              commit → 요약 → 공유,
              <br />단 3단계
            </h2>
            <p data-i18n="demo_p">
              평소처럼 코드를 push하면 GitBlog가 알아서 변경 내용을 분석하고
              읽기 좋은 글로 만들어 줍니다.
            </p>
            <div className="tag-list">
              <span className="tag">한국어</span>
              <span className="tag">日本語</span>
              <span className="tag">English</span>
              <span className="tag">中文</span>
            </div>
            <a
              href="#"
              className="btn-hero-green"
              style={{ fontSize: "14px", padding: "9px 20px" }}
            >
              <span data-i18n="demo_cta">무료로 시작하기 →</span>
            </a>
          </div>
          <div className="demo-card">
            <div className="demo-card-header">
              <span className="dot dot-r"></span>
              <span className="dot dot-y"></span>
              <span className="dot dot-g"></span>
              <span className="demo-card-title" data-i18n="demo_card_title">
                오늘의 변경사항 — main.py
              </span>
            </div>
            <div className="demo-card-body">
              <div className="diff-line diff-remove">
                - def fetch_data(url):
              </div>
              <div className="diff-line diff-remove">
                - response = requests.get(url)
              </div>
              <div className="diff-line diff-add">
                + async def fetch_data(url: str) -&gt; dict:
              </div>
              <div className="diff-line diff-add">
                + async with aiohttp.ClientSession() as s:
              </div>
              <div className="diff-line diff-add">
                + response = await s.get(url)
              </div>
              <div className="diff-line diff-context">
                {" "}
                return response.json()
              </div>
              <div className="summary-box">
                <div className="summary-label" data-i18n="ai_label">
                  ✦ AI 요약
                </div>
                <div className="summary-text" data-i18n-html="ai_summary">
                  <strong style={{ color: "#e6edf3" }}>
                    데이터 요청 방식을 비동기(async/await)로 전환했습니다.
                  </strong>
                  <br />
                  aiohttp를 도입해 병렬 네트워크 처리 성능을 개선하고 타입
                  힌트를 추가해 코드 안정성을 높였습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWITTER SHARE */}
      <section className="share-section">
        <div className="share-card">
          <div className="share-icon">🐦</div>
          <h3 data-i18n="share_title">오늘의 작업을 세상에 공유하세요</h3>
          <p data-i18n-html="share_desc">
            AI가 만든 요약본을 트위터에 바로 올리세요.
            <br />
            개발 일지를 꾸준히 공유하면 당신의 성장이 보입니다.
          </p>
          <button className="btn-twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span data-i18n="share_btn">트위터로 공유하기</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          <span data-i18n="footer_copy">
            © 2025 GitBlog. GitHub 레포를 블로그처럼.
          </span>
          —{" "}
          <a
            href="#"
            style={{ color: "var(--gh-accent)", textDecoration: "none" }}
            data-i18n="footer_privacy"
          >
            개인정보처리방침
          </a>
          ·{" "}
          <a
            href="#"
            style={{ color: "var(--gh-accent)", textDecoration: "none" }}
            data-i18n="footer_terms"
          >
            이용약관
          </a>
        </p>
      </footer>
    </>
  );
}

export default Landing;

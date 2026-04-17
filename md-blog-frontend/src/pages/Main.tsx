import { useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import styles from "./Main.module.css";

type Repo = {
  name: string;
  desc: string;
  lang: string;
  langColor: string;
  isBlog: boolean;
  updated: string;
};

type BlogRepo = {
  name: string;
  mdCount: number;
  published: number;
  draft: number;
};

type FileType = "added" | "modified" | "deleted";

type UpdateFile = {
  file: string;
  type: FileType;
  msg: string;
  add: number;
  del: number;
  time: string;
};

type UpdateRepo = {
  name: string;
  langColor: string;
  totalAdd: number;
  totalDel: number;
  files: UpdateFile[];
};

type SectionKey = "repo" | "blog" | "update";

const REPOS: Repo[] = [
  {
    name: "design-system",
    desc: "사내 디자인 시스템 컴포넌트 라이브러리",
    lang: "TypeScript",
    langColor: "#3178c6",
    isBlog: true,
    updated: "1시간 전",
  },
  {
    name: "ai-chat-api",
    desc: "실시간 AI 채팅 REST API 서버",
    lang: "TypeScript",
    langColor: "#3178c6",
    isBlog: false,
    updated: "3시간 전",
  },
  {
    name: "react-hooks-kit",
    desc: "자주 쓰는 커스텀 훅 모음 라이브러리",
    lang: "TypeScript",
    langColor: "#3178c6",
    isBlog: true,
    updated: "어제",
  },
  {
    name: "data-pipeline",
    desc: "ETL 파이프라인 — Kafka + Spark",
    lang: "Python",
    langColor: "#3572A5",
    isBlog: false,
    updated: "2일 전",
  },
  {
    name: "go-microservice",
    desc: "gRPC 기반 마이크로서비스 보일러플레이트",
    lang: "Go",
    langColor: "#00ADD8",
    isBlog: false,
    updated: "4일 전",
  },
  {
    name: "rust-parser",
    desc: "고성능 로그 파서",
    lang: "Rust",
    langColor: "#dea584",
    isBlog: true,
    updated: "1주 전",
  },
  {
    name: "ml-classifier",
    desc: "이미지 분류 모델 학습 및 서빙",
    lang: "Python",
    langColor: "#3572A5",
    isBlog: false,
    updated: "2주 전",
  },
];

const BLOG_REPOS: BlogRepo[] = [
  { name: "design-system", mdCount: 11, published: 9, draft: 2 },
  { name: "react-hooks-kit", mdCount: 8, published: 6, draft: 2 },
  { name: "rust-parser", mdCount: 5, published: 3, draft: 2 },
];

const UPDATE_REPOS: UpdateRepo[] = [
  {
    name: "design-system",
    langColor: "#3178c6",
    totalAdd: 166,
    totalDel: 44,
    files: [
      {
        file: "components/Button.tsx",
        type: "added",
        msg: "feat: ghost variant 추가",
        add: 42,
        del: 3,
        time: "09:14",
      },
      {
        file: "components/TokenTable.tsx",
        type: "modified",
        msg: "refactor: 토큰 렌더링 로직 분리",
        add: 28,
        del: 31,
        time: "10:02",
      },
      {
        file: "styles/tokens.css",
        type: "modified",
        msg: "chore: spacing 토큰 정리",
        add: 34,
        del: 10,
        time: "15:50",
      },
      {
        file: "tests/Button.test.tsx",
        type: "added",
        msg: "test: ghost variant 스냅샷 추가",
        add: 62,
        del: 0,
        time: "16:30",
      },
    ],
  },
  {
    name: "react-hooks-kit",
    langColor: "#3178c6",
    totalAdd: 26,
    totalDel: 5,
    files: [
      {
        file: "hooks/useDebounce.ts",
        type: "modified",
        msg: "fix: cleanup 타이밍 이슈 수정",
        add: 7,
        del: 5,
        time: "11:30",
      },
      {
        file: "hooks/usePrevious.ts",
        type: "added",
        msg: "feat: 제네릭 타입 파라미터 지원",
        add: 19,
        del: 0,
        time: "11:45",
      },
    ],
  },
  {
    name: "ai-chat-api",
    langColor: "#3178c6",
    totalAdd: 71,
    totalDel: 8,
    files: [
      {
        file: "api/chat/route.ts",
        type: "modified",
        msg: "feat: 스트리밍 청크 사이즈 조정",
        add: 15,
        del: 8,
        time: "13:20",
      },
      {
        file: "middleware/rateLimit.ts",
        type: "added",
        msg: "feat: IP별 rate limit 추가",
        add: 56,
        del: 0,
        time: "14:10",
      },
    ],
  },
];

function dotClass(type: FileType): string {
  if (type === "added") return styles.dotAdded;
  if (type === "deleted") return styles.dotDeleted;
  return styles.dotModified;
}

function Main() {
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    repo: false,
    blog: false,
    update: false,
  });
  const [updateOpen, setUpdateOpen] = useState<Record<number, boolean>>({});

  const toggleSection = (key: SectionKey) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleUpdateRepo = (i: number) => {
    setUpdateOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.greeting}>
          <div className={styles.greetingSub}>금요일, 2026년 4월 17일</div>
          <div className={styles.greetingTitle}>
            안녕하세요, <span>kim-dev</span> 님
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>연동된 레포지토리</div>
            <div className={styles.statValue}>7</div>
            <div className={styles.statSub} style={{ color: "#3fb950" }}>
              +2 이번 달
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>블로그 연동 레포</div>
            <div className={styles.statValue}>3</div>
            <div className={styles.statSub} style={{ color: "#a371f7" }}>
              md 파일 24개
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>오늘 수정된 파일</div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statSub} style={{ color: "#d29922" }}>
              +243 / −57 lines
            </div>
          </div>
        </div>

        {/* SECTION 1: 레포지토리 관리 */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection("repo")}
          >
            <div className={styles.sectionHeaderLeft}>
              <div className={cx(styles.sectionIcon, styles.iconRepo)}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#58a6ff">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                </svg>
              </div>
              <span className={styles.sectionTitle}>레포지토리 관리</span>
              <span className={styles.sectionCount}>7</span>
            </div>
            <div className={styles.sectionHeaderRight}>
              <button
                className={styles.headerActionBtn}
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
                레포 추가
              </button>
              <svg
                className={cx(styles.chevron, !collapsed.repo && styles.open)}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>
          <div
            className={cx(
              styles.sectionBody,
              collapsed.repo && styles.collapsed,
            )}
          >
            <div>
              {REPOS.map((r) => (
                <div key={r.name} className={styles.repoItem}>
                  <span
                    className={styles.repoDot}
                    style={{ background: r.langColor }}
                  ></span>
                  <div className={styles.repoInfo}>
                    <div className={styles.repoName}>{r.name}</div>
                    <div className={styles.repoDesc}>{r.desc}</div>
                  </div>
                  <div className={styles.repoMetaRight}>
                    <span className={cx(styles.tag, styles.tagLang)}>
                      {r.lang}
                    </span>
                    {r.isBlog && (
                      <span className={cx(styles.tag, styles.tagBlog)}>
                        블로그
                      </span>
                    )}
                    <span className={cx(styles.tag, styles.tagActive)}>
                      연동됨
                    </span>
                    <span className={styles.repoUpdated}>{r.updated}</span>
                  </div>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="#484f58"
                    strokeWidth="1.6"
                    style={{ flexShrink: 0, marginLeft: 4 }}
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <a className={styles.footerLink} href="#">
                전체 레포지토리 관리
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M1 8h14M9 2l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 2: 블로그 관리 */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection("blog")}
          >
            <div className={styles.sectionHeaderLeft}>
              <div className={cx(styles.sectionIcon, styles.iconBlog)}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#3fb950">
                  <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 012 .756zM8.755 4.75l-.004 7.322a3.752 3.752 0 012-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
                </svg>
              </div>
              <span className={styles.sectionTitle}>블로그 관리</span>
              <span className={styles.sectionCount}>3개 레포</span>
            </div>
            <div className={styles.sectionHeaderRight}>
              <button
                className={styles.headerActionBtn}
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
                블로그 추가
              </button>
              <svg
                className={cx(styles.chevron, !collapsed.blog && styles.open)}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>
          <div
            className={cx(
              styles.sectionBody,
              collapsed.blog && styles.collapsed,
            )}
          >
            <div>
              {BLOG_REPOS.map((br) => (
                <div key={br.name} className={styles.blogRepoRow}>
                  <div className={styles.blogRepoIcon}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="#a371f7"
                    >
                      <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 012 .756zM8.755 4.75l-.004 7.322a3.752 3.752 0 012-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
                    </svg>
                  </div>
                  <div className={styles.blogRepoInfo}>
                    <div className={styles.blogRepoName}>{br.name}</div>
                    <div className={styles.blogRepoSub}>
                      md 파일 {br.mdCount}개
                    </div>
                  </div>
                  <div className={styles.blogRepoRight}>
                    <span className={styles.pubCount}>발행 {br.published}</span>
                    <span className={styles.draftCount}>
                      임시저장 {br.draft}
                    </span>
                    <span className={styles.mdCount}>{br.mdCount} md</span>
                  </div>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="#484f58"
                    strokeWidth="1.6"
                    style={{ flexShrink: 0, marginLeft: 4 }}
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <a className={styles.footerLink} href="#">
                블로그 전체 설정
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M1 8h14M9 2l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 3: 오늘의 업데이트 */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection("update")}
          >
            <div className={styles.sectionHeaderLeft}>
              <div className={cx(styles.sectionIcon, styles.iconUpdate)}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#d29922">
                  <path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.22.53l2.25 2.25a.75.75 0 101.06-1.06L8.75 7.94V4.75z" />
                </svg>
              </div>
              <span className={styles.sectionTitle}>오늘의 업데이트</span>
              <span className={styles.sectionCount}>레포 3 · 파일 8</span>
            </div>
            <div className={styles.sectionHeaderRight}>
              <span className={styles.updateDateLabel}>Apr 17, 2026</span>
              <svg
                className={cx(styles.chevron, !collapsed.update && styles.open)}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>
          <div
            className={cx(
              styles.sectionBody,
              collapsed.update && styles.collapsed,
            )}
          >
            <div>
              {UPDATE_REPOS.map((ur, i) => (
                <div key={ur.name} className={styles.updateRepoGroup}>
                  <div
                    className={styles.updateRepoHeader}
                    onClick={() => toggleUpdateRepo(i)}
                  >
                    <div className={styles.updateRepoIcon}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill={ur.langColor}
                      >
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                      </svg>
                    </div>
                    <span className={styles.updateRepoName}>{ur.name}</span>
                    <div className={styles.updateRepoStats}>
                      <span className={styles.diffAdd}>+{ur.totalAdd}</span>
                      <span style={{ color: "#484f58" }}>/</span>
                      <span className={styles.diffDel}>−{ur.totalDel}</span>
                    </div>
                    <span className={styles.updateFileCount}>
                      {ur.files.length}개 파일
                    </span>
                    <svg
                      className={cx(
                        styles.chevron,
                        updateOpen[i] && styles.open,
                      )}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="#8b949e"
                      strokeWidth="1.8"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </div>
                  <div
                    className={cx(
                      styles.updateFiles,
                      !updateOpen[i] && styles.collapsed,
                    )}
                  >
                    {ur.files.map((f) => (
                      <div key={f.file} className={styles.updateFileItem}>
                        <span
                          className={cx(styles.fileTypeDot, dotClass(f.type))}
                        ></span>
                        <span className={styles.fileName}>{f.file}</span>
                        <span className={styles.fileMsg}>{f.msg}</span>
                        <div className={styles.fileDiff}>
                          <span className={styles.diffAdd}>+{f.add}</span>
                          <span style={{ color: "#484f58" }}>/</span>
                          <span className={styles.diffDel}>−{f.del}</span>
                        </div>
                        <span className={styles.fileTime}>{f.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <a className={styles.footerLink} href="#">
                전체 커밋 히스토리
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M1 8h14M9 2l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Main;

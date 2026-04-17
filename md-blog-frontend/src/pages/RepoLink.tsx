import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";
import { REPOLINK_I18N } from "../i18n/repolink";
import { getPublicRepos, connectRepos } from "../api/repoApi";
import type { GithubRepo } from "../api/repoApi";
import styles from "./RepoLink.module.css";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}달 전`;
  return `${Math.floor(months / 12)}년 전`;
}

function RepoLink() {
  const { lang } = useLang();
  const { token } = useAuth();
  const navigate = useNavigate();
  const t = REPOLINK_I18N[lang];
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isRepoLoading, setIsRepoLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    getPublicRepos(token)
      .then(setRepos)
      .finally(() => setIsRepoLoading(false));
  }, [token]);

  const availableLangs = useMemo(
    () => [...new Set(repos.map((r) => r.language).filter(Boolean) as string[])].sort(),
    [repos],
  );

  const filteredRepos = useMemo(
    () =>
      repos.filter(
        (r) =>
          (!searchQuery ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())) &&
          (!langFilter || r.language === langFilter),
      ),
    [repos, searchQuery, langFilter],
  );

  const toggleRepo = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelected(
      checked ? new Set(filteredRepos.map((r) => r.name)) : new Set(),
    );
  };

  const allChecked =
    filteredRepos.length > 0 &&
    filteredRepos.every((r) => selected.has(r.name));
  const someChecked = filteredRepos.some((r) => selected.has(r.name));
  const selectedNames = [...selected];

  const handleConnect = async () => {
    if (!token || selected.size === 0) return;
    const selectedRepos = repos.filter((r) => selected.has(r.name));
    setIsConnecting(true);
    try {
      await connectRepos(token, selectedRepos);
      setToastMsg(`${selected.size}${t.toast_success}`);
      setShowToast(true);
      setTimeout(() => navigate("/main"), 2000);
    } catch {
      setToastMsg("연동 중 오류가 발생했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageBadge}>
            <div className={styles.badgeDot}></div>{t.badge}
          </div>
          <h1 className={styles.pageTitle}>
            {t.title.split(t.title_highlight)[0]}
            <span>{t.title_highlight}</span>
            {t.title.split(t.title_highlight)[1]}
          </h1>
          <p className={styles.pageDesc}>
            {t.desc.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
        </div>

        <div className={styles.accountBox}>
          <div className={styles.accountInfo}>
            <div className={styles.ghAvatar}>K</div>
            <div>
              <div className={styles.accountName}>kim-dev</div>
              <div className={styles.accountSub}>github.com/kim-dev</div>
            </div>
          </div>
          <div className={styles.accountStatus}>
            <div className={styles.statusDot}></div>{t.auth_status}
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M10.5 10.5L14 14" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder={t.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className={styles.filterSelect}
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
            >
              <option value="">{t.lang_all}</option>
              {availableLangs.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <span className={styles.countBadge}>
            {t.count_badge} <strong>{filteredRepos.length}</strong>{t.count_unit}
          </span>
        </div>

        <div className={styles.listHeader}>
          <div className={styles.listHeaderLeft}>
            <input
              type="checkbox"
              id="selectAll"
              className={styles.repoCheck}
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = !allChecked && someChecked;
              }}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <label htmlFor="selectAll">{t.select_all}</label>
          </div>
          <button
            className={`${styles.btnCollapse}${isCollapsed ? " " + styles.collapsed : ""}`}
            onClick={() => setIsCollapsed((v) => !v)}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
            <span>{isCollapsed ? t.expand : t.collapse}</span>
          </button>
        </div>

        <div className={styles.repoListOuter}>
          <div className={`${styles.repoListBody}${isCollapsed ? " " + styles.collapsed : ""}`}>
            {isRepoLoading ? (
              <div style={{ padding: "48px 24px", textAlign: "center", fontSize: 14, color: "#8b949e" }}>
                불러오는 중...
              </div>
            ) : filteredRepos.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 14, color: "#8b949e" }}>
                  {t.no_result}
                </div>
              </div>
            ) : (
              filteredRepos.map((r) => (
                <div
                  key={r.name}
                  className={`${styles.repoItem}${selected.has(r.name) ? " " + styles.selected : ""}`}
                  onClick={() => toggleRepo(r.name)}
                >
                  <input
                    type="checkbox"
                    className={styles.repoCheck}
                    checked={selected.has(r.name)}
                    onChange={() => toggleRepo(r.name)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={styles.repoBody}>
                    <div className={styles.repoTop}>
                      <span className={styles.repoName}>{r.name}</span>
                      <span className={styles.repoVis}>{t.repo_public}</span>
                    </div>
                    <div className={styles.repoDesc}>{r.description}</div>
                    <div className={styles.repoMeta}>
                      {r.language && (
                        <span className={styles.metaItem}>
                          <span
                            className={styles.langDot}
                            style={{ background: LANG_COLORS[r.language] ?? "#8b949e" }}
                          ></span>
                          {r.language}
                        </span>
                      )}
                      <span className={styles.metaItem}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                        </svg>
                        {r.stars}
                      </span>
                      <span className={styles.metaItem}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0z" />
                        </svg>
                        {r.forks}
                      </span>
                      <span className={styles.metaItem} style={{ color: "#484f58" }}>
                        {t.updated} {timeAgo(r.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {isCollapsed && (
            <div className={`${styles.collapsedStrip} ${styles.visible}`}>
              <span className={styles.stripText}>
                {selected.size > 0 ? (
                  <>
                    <strong>{filteredRepos.length}개</strong> 레포지토리
                    &nbsp;·&nbsp;{" "}
                    <strong style={{ color: "#58a6ff" }}>
                      {selected.size}개
                    </strong>{" "}
                    선택됨
                  </>
                ) : (
                  <>
                    <strong>{filteredRepos.length}개</strong> 레포지토리
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </main>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.selectedSummary}>
            <div>
              <div className={styles.selectedCount}>{selected.size}</div>
              <div className={styles.selectedLabel}>{t.selected_unit}</div>
            </div>
            <div className={styles.barDivider}></div>
            <div className={styles.selectedNames}>
              {selected.size > 0
                ? selectedNames.slice(0, 3).join(", ") +
                  (selectedNames.length > 3
                    ? ` ${t.selected_more.replace("%d", String(selectedNames.length - 3))}`
                    : "")
                : t.selected_placeholder}
            </div>
          </div>
          <div className={styles.barActions}>
            <button className={styles.btnSkip}>{t.btn_skip}</button>
            <button
              className={styles.btnConnect}
              disabled={selected.size === 0 || isConnecting}
              onClick={handleConnect}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M1 8h14M9 2l6 6-6 6" />
              </svg>
              {t.btn_connect}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={`${styles.toast} ${styles.show}`}>
          <div className={styles.toastIcon}>✓</div>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}

export default RepoLink;

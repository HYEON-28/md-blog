import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BlogSettings.module.css";
import { getConnectedRepos, addBlogRepos, removeBlogRepos, type ConnectedRepo } from "../api/repoApi";
import { useAuth } from "../context/AuthContext";
import { toRelativeTime } from "../utils/time";

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
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

function BlogSettings() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [allSearch, setAllSearch] = useState("");
  const [allLang, setAllLang] = useState("전체 언어");
  const [blogSearch, setBlogSearch] = useState("");

  const [selectedAll, setSelectedAll] = useState<Set<number>>(new Set());
  const [selectedBlog, setSelectedBlog] = useState<Set<number>>(new Set());

  const fetchRepos = () => {
    if (!token) return;
    setLoading(true);
    getConnectedRepos(token)
      .then(setConnectedRepos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
  }, [token]);

  const allLangs = Array.from(
    new Set(connectedRepos.map((r) => r.language).filter(Boolean))
  ) as string[];

  const filteredAll = connectedRepos
    .filter((r) => r.name.toLowerCase().includes(allSearch.toLowerCase()))
    .filter((r) => allLang === "전체 언어" || r.language === allLang);

  const blogRepos = connectedRepos
    .filter((r) => r.blog)
    .filter((r) => r.name.toLowerCase().includes(blogSearch.toLowerCase()));

  const toggleAll = (id: number) => {
    setSelectedAll((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllSelect = (checked: boolean) => {
    setSelectedAll(checked ? new Set(filteredAll.map((r) => r.githubRepoId)) : new Set());
  };

  const toggleBlog = (id: number) => {
    setSelectedBlog((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleBlogSelect = (checked: boolean) => {
    setSelectedBlog(checked ? new Set(blogRepos.map((r) => r.githubRepoId)) : new Set());
  };

  const handleAddBlog = async () => {
    if (!token || selectedAll.size === 0) return;
    setAdding(true);
    try {
      await addBlogRepos(token, Array.from(selectedAll));
      setSelectedAll(new Set());
      fetchRepos();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveBlog = async () => {
    if (!token || selectedBlog.size === 0) return;
    setRemoving(true);
    try {
      await removeBlogRepos(token, Array.from(selectedBlog));
      setSelectedBlog(new Set());
      fetchRepos();
    } catch (e) {
      console.error(e);
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#8b949e", padding: 40 }}>불러오는 중...</div>;
  }

  return (
    <>
      <nav className={styles.nav}>
        <a className={styles.navLogo} href="#">
          <div className={styles.navLogoMark}>gx</div>
          <span className={styles.navLogoText}>GitXpert</span>
        </a>
        <div className={styles.navAvatar}>KD</div>
      </nav>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/main"); }}>대시보드</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>블로그 설정</span>
        </div>

        <div className={styles.pageHeader}>
          <div className={styles.pageTitle}>블로그 설정</div>
          <div className={styles.pageDesc}>
            연동된 레포지토리 중 블로그로 전환할 레포를 선택합니다. 선택된 레포의 md 파일이 블로그 카테고리로 구성됩니다.
          </div>
        </div>

        {/* SECTION 1: 연동된 전체 레포 */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={`${styles.cardIcon} ${styles.iconAll}`}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#58a6ff">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                </svg>
              </div>
              <span className={styles.cardTitle}>연동된 레포지토리</span>
              <span className={styles.cardCount}>{filteredAll.length}</span>
            </div>
          </div>
          <div className={styles.cardToolbar}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M10.5 10.5L14 14" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="레포지토리 검색..."
                value={allSearch}
                onChange={(e) => setAllSearch(e.target.value)}
              />
            </div>
            <select
              className={styles.langFilter}
              value={allLang}
              onChange={(e) => setAllLang(e.target.value)}
            >
              <option>전체 언어</option>
              {allLangs.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className={styles.selectAllRow}>
            <div className={styles.selectAllLeft}>
              <input
                type="checkbox"
                className={styles.repoCheck}
                id="sa1"
                checked={filteredAll.length > 0 && selectedAll.size === filteredAll.length}
                onChange={(e) => toggleAllSelect(e.target.checked)}
              />
              <label htmlFor="sa1">전체 선택</label>
            </div>
            <span className={styles.selInfo}>
              연동 레포 <strong className={styles.selInfoCountBlue}>{filteredAll.length}</strong>개
            </span>
          </div>
          <div className={styles.repoRows}>
            {filteredAll.length === 0 ? (
              <div style={{ padding: "16px 18px", fontSize: 13, color: "#8b949e" }}>레포지토리가 없습니다.</div>
            ) : (
              filteredAll.map((r) => (
                <div key={r.githubRepoId} className={styles.repoRow} onClick={() => toggleAll(r.githubRepoId)}>
                  <input
                    type="checkbox"
                    className={styles.repoCheck}
                    checked={selectedAll.has(r.githubRepoId)}
                    onChange={() => toggleAll(r.githubRepoId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={styles.repoDot} style={{ background: LANG_COLORS[r.language ?? ""] ?? "#8b949e" }} />
                  <div className={styles.repoInfo}>
                    <div className={styles.repoName}>{r.name}</div>
                    <div className={styles.repoDesc}>{r.description ?? ""}</div>
                  </div>
                  <div className={styles.repoRight}>
                    {r.language && <span className={`${styles.tag} ${styles.tagLang}`}>{r.language}</span>}
                    <span className={`${styles.tag} ${styles.tagLinked}`}>연동됨</span>
                    {r.blog && <span className={`${styles.tag} ${styles.tagBlog}`}>블로그</span>}
                    <span className={styles.repoDate}>{toRelativeTime(r.pushedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.actionBar}>
            <span className={styles.actionBarInfo}>
              {selectedAll.size > 0 ? `${selectedAll.size}개 선택됨` : "블로그로 전환할 레포를 선택하세요"}
            </span>
            <button
              className={styles.btnAddBlog}
              disabled={selectedAll.size === 0 || adding}
              onClick={handleAddBlog}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 2v12M2 8h12" />
              </svg>
              {adding ? "추가 중..." : "블로그 추가"}
            </button>
          </div>
        </div>

        {/* SECTION 2: 블로그 레포 */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={`${styles.cardIcon} ${styles.iconBlog}`}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#a371f7">
                  <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 012 .756zM8.755 4.75l-.004 7.322a3.752 3.752 0 012-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
                </svg>
              </div>
              <span className={styles.cardTitle}>블로그 레포지토리</span>
              <span className={styles.cardCount}>{blogRepos.length}</span>
            </div>
          </div>
          <div className={styles.cardToolbar}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M10.5 10.5L14 14" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="블로그 레포 검색..."
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.selectAllRow}>
            <div className={styles.selectAllLeft}>
              <input
                type="checkbox"
                className={styles.repoCheck}
                id="sa2"
                checked={blogRepos.length > 0 && selectedBlog.size === blogRepos.length}
                onChange={(e) => toggleBlogSelect(e.target.checked)}
              />
              <label htmlFor="sa2">전체 선택</label>
            </div>
            <span className={styles.selInfo}>
              블로그 레포 <strong className={styles.selInfoCountPurple}>{blogRepos.length}</strong>개
            </span>
          </div>
          <div className={styles.repoRows}>
            {blogRepos.length === 0 ? (
              <div style={{ padding: "16px 18px", fontSize: 13, color: "#8b949e" }}>블로그로 등록된 레포지토리가 없습니다.</div>
            ) : (
              blogRepos.map((r) => (
                <div key={r.githubRepoId} className={styles.repoRow} onClick={() => toggleBlog(r.githubRepoId)}>
                  <input
                    type="checkbox"
                    className={styles.repoCheck}
                    checked={selectedBlog.has(r.githubRepoId)}
                    onChange={() => toggleBlog(r.githubRepoId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={styles.repoDot} style={{ background: LANG_COLORS[r.language ?? ""] ?? "#8b949e" }} />
                  <div className={styles.repoInfo}>
                    <div className={`${styles.repoName} ${styles.repoNameBlog}`}>{r.name}</div>
                    <div className={styles.repoDesc}>{r.description ?? ""}</div>
                  </div>
                  <div className={styles.repoRight}>
                    {r.language && <span className={`${styles.tag} ${styles.tagLang}`}>{r.language}</span>}
                    <span className={`${styles.tag} ${styles.tagBlog}`}>블로그</span>
                    <span className={styles.repoDate}>{toRelativeTime(r.pushedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.actionBar}>
            <span className={styles.actionBarInfo}>
              {selectedBlog.size > 0 ? `${selectedBlog.size}개 선택됨` : "블로그에서 제외할 레포를 선택하세요"}
            </span>
            <button
              className={styles.btnRemoveBlog}
              disabled={selectedBlog.size === 0 || removing}
              onClick={handleRemoveBlog}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 8h12" />
              </svg>
              {removing ? "제거 중..." : "블로그 제거"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogSettings;

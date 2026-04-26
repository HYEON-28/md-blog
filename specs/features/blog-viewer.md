# Feature: 블로그 메인 + md 파일 뷰어

## Part 1: 서브도메인 라우팅 + 블로그 메인

**Status:** 기본 구현 완료

### 목적
`username.md-blog.org` 주소로 접근하면 해당 유저의 블로그 메인 페이지를 보여준다.

### 서브도메인 감지 규칙

| 환경 | 호스트 예시 | username 추출 |
|------|------------|--------------|
| 개발 | `hyeon28.localhost` | `hyeon28` |
| 운영 | `hyeon28.md-blog.org` | `hyeon28` |
| 메인 앱 | `md-blog.org`, `www.md-blog.org` | null → 일반 앱 라우팅 |

`App.tsx`의 `getBlogUsername()` 함수가 hostname 파싱을 담당한다.

### 현재 구현된 블로그 메인 화면
- 유저 아바타, GitHub username, name 표시
- 존재하지 않는 username이면 404 메시지

### 수용 기준

- [x] 서브도메인 접근 시 일반 앱 라우팅을 완전히 우회
- [x] username에 해당하는 유저가 없으면 404 화면
- [x] API 오류 시 에러 메시지

### API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/blog/{username}` | 블로그 메인 정보 반환 |

```typescript
BlogMain {
  username: string
  name: string | null
  avatarUrl: string | null
}
```

---

## Part 2: md 파일 목록 + 뷰어

**Status:** 미구현

### 목적
블로그로 지정된 레포의 md 파일들을 트리 구조로 탐색하고 렌더링해서 보여준다.

### 기획된 화면 구성
1. **블로그 사이드바**: 레포 목록 → 폴더/파일 트리
2. **md 파일 뷰어**: frontmatter 파싱, HTML 렌더링
3. **다국어 번역**: 선택한 언어로 md 내용 번역 (i18n spec 참조)

### 미구현 이유
DB에 `md_files`, `md_file_tree`, `repository_snapshots` 스키마는 준비되어 있으나 백엔드 동기화 로직과 프론트 뷰어 컴포넌트가 아직 없음.

### 구현 필요 목록
- [ ] GitHub 레포 → DB md 파일 동기화 (스냅샷, tree SHA 기반 변경 감지)
- [ ] `GET /api/blog/{username}/{repoName}/tree` — 파일 트리 API
- [ ] `GET /api/blog/{username}/{repoName}/file?path=` — md 파일 내용 API
- [ ] 프론트 파일 트리 컴포넌트
- [ ] md 렌더링 컴포넌트 (react-markdown 또는 유사 라이브러리)

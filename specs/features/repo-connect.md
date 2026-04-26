# Feature: 레포지토리 연동 관리

**Status:** 구현 완료

## 목적
사용자의 GitHub public 레포지토리를 md-blog에 연동해 오늘의 업데이트 추적과 블로그 기능을 사용할 수 있게 한다.

## 사용자 시나리오

### 최초 연동 (RepoLink)
1. 로그인 후 연동된 레포가 없으면 `/repolink` 로 이동
2. GitHub public 레포 목록을 불러와 표시 (최대 100개, 업데이트 순 정렬)
3. 검색창, 언어 필터로 레포 탐색
4. 여러 레포 체크박스로 선택
5. "연동하기" 버튼 클릭 → 선택한 레포들을 DB에 저장 → `/main` 으로 이동

### 연동 변경 (RepoSettings)
1. `/main` 에서 "레포 설정" 버튼 클릭 → `/repoSettings` 이동
2. 현재 연동된 레포와 연동 안 된 레포를 함께 표시
3. 체크박스로 연동/해제 토글
4. "저장" 클릭 → 신규 선택은 connect API, 선택 해제는 disconnect API 호출

## 수용 기준

- [x] public 레포만 연동 가능 (private 필터링)
- [x] 연동 해제는 soft delete (`user_repositories.active = false`)
- [x] 동일 레포를 재연동하면 active를 true로 복구
- [x] `ConnectedRepo` 응답에 `blog: boolean` 포함 (블로그 지정 여부)
- [x] 연동 레포 목록에서 `pushedAt` 기준 상대 시간 표시

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/repos/public` | GitHub API에서 public 레포 목록 조회 |
| GET | `/api/repos/connected` | 현재 연동된 레포 목록 조회 |
| POST | `/api/repos/connect` | 레포 연동 (여러 개 한 번에) |
| POST | `/api/repos/disconnect` | 연동 해제 (githubRepoId 배열) |

### 요청/응답 타입

```typescript
// GET /api/repos/public
GithubRepo {
  githubRepoId: number
  ownerGithubId: number
  name: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  updatedAt: string
  htmlUrl: string
  defaultBranch: string
}

// GET /api/repos/connected
ConnectedRepo {
  githubRepoId: number
  name: string
  description: string | null
  language: string | null
  htmlUrl: string
  pushedAt: string
  blog: boolean
}

// POST /api/repos/connect
{ repos: GithubRepo[] }

// POST /api/repos/disconnect
{ githubRepoIds: number[] }
```

## 프론트엔드 구조

- `RepoLink.tsx` — 최초 연동 페이지 (검색, 필터, 다중 선택)
- `RepoSettings.tsx` — 연동 변경 페이지
- `repoApi.ts` — API 호출 함수

## DB 구조

- `repositories` — GitHub 레포 메타데이터 캐시 (github_repo_id unique)
- `user_repositories` — 유저-레포 연동 관계 (active 플래그로 soft delete)

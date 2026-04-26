# Feature: 오늘의 업데이트 + 파일 diff 뷰어

**Status:** 구현 완료

## 목적
오늘(서울 기준 자정 이후) 연동된 레포에서 변경된 파일과 커밋 내역을 확인한다.

## 오늘의 업데이트 조회

### 동작 방식
1. 연동된 모든 레포에 대해 GitHub API `/repos/{fullName}/commits?since={오늘 서울 자정 UTC}` 호출
2. 커밋별로 변경된 파일 상세 (`/repos/{fullName}/commits/{sha}`) 추가 조회
3. 같은 파일이 여러 커밋에서 변경된 경우 additions/deletions를 합산
4. 파일 상태는 최초 기록 기준 (added/modified/deleted)
5. 변경 없는 레포는 결과에서 제외

### 응답 구조

```typescript
TodayUpdateRepo {
  repoName: string
  repoFullName: string
  language: string | null
  totalAdd: number
  totalDel: number
  files: TodayFileChange[]
}

TodayFileChange {
  filePath: string
  changeType: "added" | "modified" | "deleted"
  commitMessage: string  // 첫 번째 줄만
  additions: number
  deletions: number
  time: string           // HH:mm (서울 시간)
}
```

## 파일 diff 뷰어 (`/file-updated`)

### 진입
- 대시보드 오늘의 업데이트에서 파일 클릭
- React Router `location.state` 로 `{ repoFullName, repoName, filePath }` 전달

### 화면 구성
1. **브레드크럼**: 대시보드 › 오늘의 업데이트 › {repoName} › {filePath}
2. **파일 헤더**: 변경 타입 배지, 파일 경로, 오늘 커밋 수, 총 +/- 라인
3. **커밋 타임라인**: 오늘 커밋 목록 (번호, 메시지, sha 7자리, 시간, +/- 라인, latest 뱃지)
   - 클릭하면 해당 커밋의 diff 표시
4. **diff 뷰어**: Split(기본) / Unified 토글
   - Split: 좌(old) / 우(new) 나란히 표시
   - Unified: 한 컬럼에 +/- 라인 표시
   - 라인 번호, hunk 헤더(@@ ... @@) 포함
5. **커밋 정보 카드**: 메시지, sha, 시간, repoFullName
6. **GitHub 링크**: 해당 커밋 GitHub 페이지로 이동

### 수용 기준

- [x] `location.state` 없으면 `/main` 으로 리다이렉트
- [x] 오늘 커밋 없는 파일이면 빈 상태 메시지
- [x] patch 없는 경우(바이너리, 변경량 초과) "diff 정보 없음" 표시
- [x] 첫 번째 커밋을 latest로 표시
- [x] 커밋 타임라인은 최신 순 (GitHub API 기본 정렬)

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/repos/today-updates` | 연동 레포 전체 오늘 변경 요약 |
| GET | `/api/repos/file-detail?repoFullName=&filePath=` | 특정 파일의 오늘 커밋 + diff |

### GitHub API 의존성
- `GET /repos/{fullName}/commits?since={iso}&per_page=20` — 오늘 커밋 목록
- `GET /repos/{fullName}/commits?since={iso}&path={filePath}&per_page=20` — 파일별 커밋
- `GET /repos/{fullName}/commits/{sha}` — 커밋 상세(파일 변경 목록 + patch)

## 프론트엔드 구조

- `FileUpdated.tsx` — diff 뷰어 페이지
- `FileUpdated.module.css` — 스타일
- `parsePatch()` — GitHub patch 문자열 → `DiffLine[]` 파싱
- `DiffUnified`, `DiffSplit`, `DiffSplitSide` — diff 렌더링 컴포넌트

## 백엔드 구조

- `TodayUpdateService` — 오늘 업데이트 집계 로직
- `GithubApiService` — GitHub REST API 호출 (RestClient 사용)
- 시간 기준: `Asia/Seoul` 자정 → UTC ISO 변환 후 since 파라미터로 사용

# DB 스키마

**DB:** MySQL 8.x  
**문자셋:** utf8mb4  
**PK 형식:** BINARY(16) UUID (ordered UUID)

---

## 현재 사용 중인 테이블

### `users`

GitHub OAuth 로그인 유저 정보를 저장한다.

| 컬럼                                 | 타입                   | 설명                         |
| ------------------------------------ | ---------------------- | ---------------------------- |
| id                                   | BINARY(16) PK          | ordered UUID                 |
| github_id                            | BIGINT UNSIGNED UNIQUE | GitHub 유저 고유 ID          |
| github_username                      | VARCHAR(50)            | GitHub 로그인명              |
| name                                 | VARCHAR(255)           | 표시 이름                    |
| email                                | VARCHAR(255)           | 이메일                       |
| avatar_url                           | VARCHAR(500)           | 프로필 이미지 URL            |
| github_profile_url                   | VARCHAR(255)           | GitHub 프로필 링크           |
| access_token                         | TEXT NOT NULL          | GitHub OAuth 액세스 토큰     |
| refresh_token                        | TEXT                   | (미사용) OAuth 리프레시 토큰 |
| last_login_at                        | DATETIME               | 마지막 로그인 시각           |
| created_at / updated_at / deleted_at | DATETIME               | 감사 컬럼                    |

- `github_id` 기준 upsert: 동일 GitHub 계정 재로그인 시 정보 갱신
- `access_token`은 매번 최신 토큰으로 업데이트 (GitHub OAuth 특성)

---

### `repositories`

GitHub 레포지토리 메타데이터 캐시. 여러 유저가 같은 레포를 연동해도 1개 row만 유지한다.

| 컬럼            | 타입                   | 설명                  |
| --------------- | ---------------------- | --------------------- |
| id              | BINARY(16) PK          |                       |
| github_repo_id  | BIGINT UNSIGNED UNIQUE | GitHub 레포 고유 ID   |
| owner_github_id | BIGINT UNSIGNED        | 레포 소유자 GitHub ID |
| name            | VARCHAR(100)           | 레포 이름             |
| full_name       | VARCHAR(200)           | owner/name 형식       |
| description     | TEXT                   | 설명                  |
| html_url        | VARCHAR(500)           | GitHub 페이지 URL     |
| default_branch  | VARCHAR(100)           | 기본 브랜치           |
| language        | VARCHAR(50)            | 주요 언어             |
| is_private      | TINYINT(1)             | private 여부 (항상 0) |

---

### `user_repositories`

유저와 레포지토리의 연동 관계.

| 컬럼          | 타입                         | 설명                         |
| ------------- | ---------------------------- | ---------------------------- |
| id            | BINARY(16) PK                |                              |
| user_id       | BINARY(16) FK → users        |                              |
| repository_id | BINARY(16) FK → repositories |                              |
| connected_at  | DATETIME                     | 최초 연동 시각               |
| active        | TINYINT(1)                   | 연동 활성 여부 (soft delete) |

- `(user_id, repository_id)` unique
- 연동 해제: `active = 0`, 재연동: `active = 1`

---

### `repository_snapshots`

GitHub 레포의 md 파일 상태 스냅샷. 레포당 1개 row (다수 유저 공유).

| 컬럼           | 타입                                | 설명                          |
| -------------- | ----------------------------------- | ----------------------------- |
| id             | BINARY(16) PK                       |                               |
| repository_id  | BINARY(16) UNIQUE FK → repositories |                               |
| sha_tree       | VARCHAR(40)                         | GitHub tree SHA (변경 감지용) |
| md_file_count  | SMALLINT UNSIGNED                   | md 파일 수                    |
| last_synced_at | DATETIME                            | 마지막 동기화 시각            |

- `sha_tree` 가 다를 때만 재동기화 (GitHub API 호출 최소화)
- **현재 동기화 로직 미구현** (블로그 뷰어 개발 시 필요)

---

### `blog_repositories`

유저가 블로그로 지정한 레포.

| 컬럼               | 타입                                 | 설명             |
| ------------------ | ------------------------------------ | ---------------- |
| id                 | BINARY(16) PK                        |                  |
| user_id            | BINARY(16) FK → users                |                  |
| user_repository_id | BINARY(16) FK → user_repositories    |                  |
| snapshot_id        | BINARY(16) FK → repository_snapshots | 공개 중인 스냅샷 |
| active             | TINYINT(1)                           | 블로그 활성 여부 |

- `(user_id, user_repository_id)` unique
- 연동 해제된 레포는 자동으로 블로그에서도 제외 (서비스 레이어에서 처리)

---

## 미구현 테이블 (DDL 설계만 완료)

### `md_files`

스냅샷에 속한 md 파일 원본 + 파싱 결과 캐시.

| 주요 컬럼        | 설명                              |
| ---------------- | --------------------------------- |
| snapshot_id      | 소속 스냅샷                       |
| file_path        | 레포 내 경로                      |
| raw_content      | md 원본                           |
| parsed_html      | 렌더링 캐시                       |
| github_sha       | blob SHA (파일 변경 감지)         |
| frontmatter      | JSON (date, tags, description 등) |
| reading_time_min | 예상 읽기 시간                    |

### `md_file_tree`

md 파일의 폴더/파일 트리 구조. self-join으로 깊이 무제한.

| 주요 컬럼  | 설명                      |
| ---------- | ------------------------- |
| parent_id  | 상위 노드 (NULL = 루트)   |
| node_type  | folder / file             |
| md_file_id | type=file 일 때만 값 있음 |

### `sync_logs`

레포 동기화 이력. 성공/실패/부분 성공 기록.

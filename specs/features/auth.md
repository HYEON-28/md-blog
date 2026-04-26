# Feature: GitHub OAuth 로그인 + JWT 인증

**Status:** 구현 완료

## 목적
GitHub 계정 하나로 로그인하고, 이후 모든 API 요청을 JWT로 인증한다.

## 사용자 시나리오

1. 비로그인 사용자가 `/` 접근 → Landing 페이지
2. "GitHub으로 로그인" 버튼 클릭 → GitHub OAuth 페이지로 리다이렉트
3. GitHub 인증 완료 → 백엔드가 JWT 발급 후 `/auth/callback?token=<jwt>` 로 리다이렉트
4. 프론트엔드 AuthCallback 컴포넌트가 JWT를 localStorage에 저장
5. `/auth/has-linked-repo` 확인:
   - 연동된 레포 없음 → `/repolink` 로 이동
   - 연동된 레포 있음 → `/main` 으로 이동
6. 로그아웃 시 localStorage에서 토큰 삭제, 상태 초기화

## 수용 기준

- [x] JWT는 `localStorage` 키 `md-blog.token` 에 저장
- [x] 앱 초기화 시 저장된 토큰으로 `/auth/me` 호출해 유저 정보 복원
- [x] `/auth/me` 실패(401) 시 localStorage 토큰 삭제 후 비로그인 상태로 전환
- [x] 로그인 상태에서 `/` 접근 시 `/main` 으로 자동 리다이렉트
- [x] 콜백에 token 파라미터 없으면 `/login?error=true` 로 이동

## 제외 범위

- 이메일/비밀번호 로그인 없음
- JWT refresh token 플로우 미구현 (DB 컬럼은 존재)

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/auth/me` | 현재 유저 정보 반환 |
| GET | `/auth/has-linked-repo` | 연동된 레포 존재 여부 확인 |
| POST | `/auth/logout` | 상태 없음(JWT stateless), 클라이언트가 토큰 삭제 |

## 프론트엔드 구조

- `AuthContext` — 전역 인증 상태 (`user`, `token`, `isLoggedIn`, `isLoading`)
- `AuthCallback.tsx` — OAuth 콜백 처리 페이지
- `Login.tsx` — 로그인 버튼 페이지
- `Landing.tsx` — 비로그인 홈

## 백엔드 구조

- Spring Security OAuth2 + `CustomOAuth2UserService`
- `OAuth2SuccessHandler` — 로그인 성공 시 JWT 발급 후 프론트로 리다이렉트
- `OAuth2FailureHandler` — 실패 시 프론트 에러 페이지로 리다이렉트
- `JwtProvider` — JWT 생성/검증
- `JwtAuthFilter` — 매 요청마다 토큰 파싱 후 SecurityContext에 User 주입

## DB

- `users` 테이블: GitHub OAuth 정보, access_token 저장
- 최초 로그인 시 upsert (github_id 기준 unique)

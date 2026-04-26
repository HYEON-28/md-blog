# Project Name: md-blog

## 프로젝트 개요

1. 로그인 기능: 깃헙으로 로그인 기능만 제공함

2. 블로그 기능: 선택한 레포의 md 파일들만 블로그 형태로 볼 수 있게 링크를 제공함

- 1-1. 블로그 기능은 여러나라 언어로 번역해주는 기능이 있음. 특정 사용자가 언어 선택 시 Local Storage에 저장해두고 다른 페이지로 이동하더라도 언어선택 유지

3. 특정 날짜와 레포를 선택해서 변경내용을 요약해줌(AI API사용)
4. 요약된 변경내용을 X(트위터)와 연동하여 자동으로 트윗 발신

## Tech Stack

- Frontend: React 18 + TypeScript
  - Build Tool: Vite
- Backend: Spring Boot
- DB: MySQL

## 개발 방식 (Spec Driven Development)

**새 기능 구현 전 반드시 스펙 먼저 작성한다.**

- 스펙 문서 위치: `specs/` 디렉토리
- 기능 스펙: `specs/features/*.md`
- API 스펙: `specs/api/openapi.yaml`
- DB 스키마 설명: `specs/db/schema.md`
- 전체 목차: `specs/README.md`

### 규칙
1. 새 기능 → `specs/features/` 에 스펙 파일 작성 후 구현 시작
2. API 추가/변경 → `specs/api/openapi.yaml` 먼저 수정
3. 미구현 기능은 스펙 파일에 `Status: 미구현` 표시
4. 구현 완료 시 스펙의 수용 기준 체크박스 업데이트
5. `specs/README.md` 목차도 함께 업데이트

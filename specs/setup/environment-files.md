# 환경 파일 이전 가이드

새 컴퓨터에서 프로젝트를 실행할 때 git으로 관리되지 않아 **수동으로 복사해야 하는 파일** 목록입니다.

---

## git에서 제외된 파일 (반드시 직접 복사)

### 1. `md-blog-backend/src/main/resources/application-dev.properties`

gitignore 적용 파일. 개발 환경의 민감 정보가 담겨 있습니다.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/md-blog?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=<DB 비밀번호>

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.security.oauth2.client.registration.github.client-secret=<GitHub OAuth App Client Secret>
spring.security.oauth2.client.registration.github.redirect-uri=http://localhost:8080/login/oauth2/code/github

jwt.secret=<32자 이상 JWT 시크릿 키>

frontend.url=http://localhost:5173
```

**필요한 값:**
- GitHub OAuth App Client Secret → [GitHub Developer Settings](https://github.com/settings/developers) 에서 `md-blog` 앱 확인
- DB 비밀번호 → 로컬 MySQL 설정에 맞게 입력
- JWT Secret → 32자 이상 임의 문자열

---

## 사전 준비 사항

### MySQL 데이터베이스 생성

```sql
CREATE DATABASE `md-blog` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

테이블은 `application-dev.properties`의 `spring.jpa.hibernate.ddl-auto=update` 설정으로 앱 실행 시 자동 생성됩니다.  
수동으로 생성하려면 `ddl/ddl.sql`을 실행하세요.

### 환경 요구 사항

| 항목 | 버전 |
|------|------|
| Java | 17 이상 |
| MySQL | 8.0 이상 |
| Node.js | 18 이상 |

---

## git으로 관리되는 파일 (복사 불필요)

아래 파일은 git에 포함되어 있으므로 `git clone` 후 별도 작업 없이 사용 가능합니다.

| 파일 | 내용 |
|------|------|
| `md-blog-frontend/.env.development` | `VITE_API_BASE_URL=http://localhost:8080` |
| `md-blog-frontend/.env.production` | `VITE_API_BASE_URL=https://api.md-blog.org` |
| `md-blog-backend/src/main/resources/application.properties` | 공통 설정 (active profile, datasource driver, GitHub client-id, JWT 만료시간) |
| `md-blog-backend/src/main/resources/application-prod.properties` | 운영 환경 변수 참조 설정 (`${ENV_VAR}` 형태) |

---

## 실행 순서 (새 컴퓨터 기준)

```bash
# 1. 레포 클론
git clone <repo-url>

# 2. application-dev.properties 생성 (위 내용 참고)
vi md-blog-backend/src/main/resources/application-dev.properties

# 3. MySQL DB 생성
mysql -u root -p -e "CREATE DATABASE \`md-blog\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. 백엔드 실행
cd md-blog-backend
./gradlew bootRun

# 5. 프론트엔드 실행
cd md-blog-frontend
npm install
npm run dev
```

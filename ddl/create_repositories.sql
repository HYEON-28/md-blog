CREATE TABLE repositories (
  id               BINARY(16)       NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)),
  github_repo_id   BIGINT UNSIGNED  NOT NULL,
  owner_github_id  BIGINT UNSIGNED  NOT NULL,
  name             VARCHAR(100)     NOT NULL,
  full_name        VARCHAR(200)     NOT NULL,
  description      TEXT,
  html_url         VARCHAR(500)     NOT NULL,
  default_branch   VARCHAR(100)     NOT NULL DEFAULT 'main',
  language         VARCHAR(50),
  is_private       TINYINT(1)       NOT NULL DEFAULT 0,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_github_repo_id (github_repo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE user_repositories (
  id             BINARY(16)   NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)),
  user_id        BINARY(16)   NOT NULL,
  repository_id  BINARY(16)   NOT NULL,
  connected_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_repository (user_id, repository_id),
  CONSTRAINT fk_ur_user        FOREIGN KEY (user_id)       REFERENCES users(id),
  CONSTRAINT fk_ur_repository  FOREIGN KEY (repository_id) REFERENCES repositories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

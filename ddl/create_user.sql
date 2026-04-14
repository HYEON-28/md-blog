CREATE TABLE users (
  id                  BINARY(16)       NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)),
  github_id           BIGINT UNSIGNED  NOT NULL,
  github_username     VARCHAR(50)      NOT NULL,
  name                VARCHAR(255),
  email               VARCHAR(255),
  avatar_url          VARCHAR(500),
  github_profile_url  VARCHAR(255),
  access_token        TEXT             NOT NULL,
  refresh_token       TEXT,
  last_login_at       DATETIME,
  created_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME,

  PRIMARY KEY (id),
  UNIQUE KEY uq_github_id    (github_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
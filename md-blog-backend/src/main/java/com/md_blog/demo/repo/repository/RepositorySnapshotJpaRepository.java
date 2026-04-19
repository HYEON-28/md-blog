package com.md_blog.demo.repo.repository;

import com.md_blog.demo.repo.entity.RepositorySnapshotEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RepositorySnapshotJpaRepository extends JpaRepository<RepositorySnapshotEntity, UUID> {
    Optional<RepositorySnapshotEntity> findByRepositoryId(UUID repositoryId);
}

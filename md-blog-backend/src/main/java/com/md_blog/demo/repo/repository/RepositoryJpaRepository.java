package com.md_blog.demo.repo.repository;

import com.md_blog.demo.repo.entity.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RepositoryJpaRepository extends JpaRepository<RepositoryEntity, UUID> {
    Optional<RepositoryEntity> findByGithubRepoId(Long githubRepoId);
    List<RepositoryEntity> findAllByGithubRepoIdIn(List<Long> githubRepoIds);
}

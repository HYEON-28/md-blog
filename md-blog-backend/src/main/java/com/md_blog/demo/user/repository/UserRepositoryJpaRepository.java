package com.md_blog.demo.user.repository;

import com.md_blog.demo.user.entity.UserRepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepositoryJpaRepository extends JpaRepository<UserRepositoryEntity, UUID> {
    boolean existsByUserIdAndActiveTrue(UUID userId);
    List<UserRepositoryEntity> findByUserIdAndActiveTrue(UUID userId);
    java.util.Optional<UserRepositoryEntity> findByUserIdAndRepositoryId(UUID userId, UUID repositoryId);
    List<UserRepositoryEntity> findByUserIdAndRepositoryIdIn(UUID userId, java.util.Collection<UUID> repositoryIds);
}


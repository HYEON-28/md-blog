package com.md_blog.demo.user.repository;

import com.md_blog.demo.user.entity.UserRepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepositoryJpaRepository extends JpaRepository<UserRepositoryEntity, UUID> {
    boolean existsByUserIdAndActiveTrue(UUID userId);
}


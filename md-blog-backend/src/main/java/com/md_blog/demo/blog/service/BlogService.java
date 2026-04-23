package com.md_blog.demo.blog.service;

import com.md_blog.demo.blog.dto.BlogMainResponse;
import com.md_blog.demo.blog.entity.BlogRepositoryEntity;
import com.md_blog.demo.blog.repository.BlogRepositoryJpaRepository;
import com.md_blog.demo.repo.entity.RepositoryEntity;
import com.md_blog.demo.repo.entity.RepositorySnapshotEntity;
import com.md_blog.demo.repo.repository.RepositoryJpaRepository;
import com.md_blog.demo.repo.repository.RepositorySnapshotJpaRepository;
import com.md_blog.demo.user.entity.User;
import com.md_blog.demo.user.entity.UserRepositoryEntity;
import com.md_blog.demo.user.repository.UserRepository;
import com.md_blog.demo.user.repository.UserRepositoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogService {

    private final BlogRepositoryJpaRepository blogRepositoryJpaRepository;
    private final RepositoryJpaRepository repositoryJpaRepository;
    private final RepositorySnapshotJpaRepository snapshotJpaRepository;
    private final UserRepositoryJpaRepository userRepositoryJpaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public BlogMainResponse getBlogMain(String username) {
        User user = userRepository.findByGithubUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean hasBlog = !blogRepositoryJpaRepository.findByUserIdAndActiveTrue(user.getId()).isEmpty();
        if (!hasBlog) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No blog found");

        return new BlogMainResponse(user.getGithubUsername(), user.getName(), user.getAvatarUrl());
    }

    @Transactional(readOnly = true)
    public Set<Long> getBlogGithubRepoIds(User user) {
        List<BlogRepositoryEntity> blogRepos = blogRepositoryJpaRepository.findByUserIdAndActiveTrue(user.getId());
        if (blogRepos.isEmpty()) return Set.of();

        Set<UUID> userRepoIds = blogRepos.stream()
                .map(BlogRepositoryEntity::getUserRepositoryId)
                .collect(Collectors.toSet());

        // user_repositories → repository_id → github_repo_id
        List<UserRepositoryEntity> userRepos = userRepositoryJpaRepository.findAllById(userRepoIds);
        Set<UUID> repoIds = userRepos.stream()
                .map(UserRepositoryEntity::getRepositoryId)
                .collect(Collectors.toSet());

        return repositoryJpaRepository.findAllById(repoIds).stream()
                .map(RepositoryEntity::getGithubRepoId)
                .collect(Collectors.toSet());
    }

    public void addBlogRepos(User user, List<Long> githubRepoIds) {
        List<RepositoryEntity> repos = repositoryJpaRepository.findAllByGithubRepoIdIn(githubRepoIds);

        for (RepositoryEntity repo : repos) {
            // user_repositories에서 해당 (user, repo) 링크 조회
            UserRepositoryEntity userRepo = userRepositoryJpaRepository
                    .findByUserIdAndRepositoryId(user.getId(), repo.getId())
                    .orElse(null);
            if (userRepo == null || !userRepo.isActive()) continue;

            // 스냅샷이 없으면 빈 스냅샷 생성 (추후 sync 시 채워짐)
            RepositorySnapshotEntity snapshot = snapshotJpaRepository
                    .findByRepositoryId(repo.getId())
                    .orElseGet(() -> snapshotJpaRepository.save(
                            RepositorySnapshotEntity.builder()
                                    .repositoryId(repo.getId())
                                    .shaTree("")
                                    .mdFileCount(0)
                                    .build()
                    ));

            blogRepositoryJpaRepository
                    .findByUserIdAndUserRepositoryId(user.getId(), userRepo.getId())
                    .ifPresentOrElse(
                            existing -> existing.activate(snapshot.getId()),
                            () -> blogRepositoryJpaRepository.save(
                                    BlogRepositoryEntity.builder()
                                            .userId(user.getId())
                                            .userRepositoryId(userRepo.getId())
                                            .snapshotId(snapshot.getId())
                                            .active(true)
                                            .build()
                            )
                    );
        }
    }

    public void removeBlogRepos(User user, List<Long> githubRepoIds) {
        List<RepositoryEntity> repos = repositoryJpaRepository.findAllByGithubRepoIdIn(githubRepoIds);
        Set<UUID> repoIds = repos.stream().map(RepositoryEntity::getId).collect(Collectors.toSet());

        // user_repositories에서 해당 링크 조회
        List<UserRepositoryEntity> userRepos = userRepositoryJpaRepository
                .findByUserIdAndRepositoryIdIn(user.getId(), repoIds);
        Set<UUID> userRepoIds = userRepos.stream()
                .map(UserRepositoryEntity::getId)
                .collect(Collectors.toSet());

        blogRepositoryJpaRepository
                .findByUserIdAndUserRepositoryIdIn(user.getId(), userRepoIds)
                .forEach(BlogRepositoryEntity::deactivate);
    }
}

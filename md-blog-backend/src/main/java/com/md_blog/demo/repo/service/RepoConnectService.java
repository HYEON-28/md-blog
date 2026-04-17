package com.md_blog.demo.repo.service;

import com.md_blog.demo.repo.dto.GithubRepoDto;
import com.md_blog.demo.repo.entity.RepositoryEntity;
import com.md_blog.demo.repo.repository.RepositoryJpaRepository;
import com.md_blog.demo.user.entity.User;
import com.md_blog.demo.user.entity.UserRepositoryEntity;
import com.md_blog.demo.user.repository.UserRepositoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RepoConnectService {

    private final RepositoryJpaRepository repositoryJpaRepository;
    private final UserRepositoryJpaRepository userRepositoryJpaRepository;

    public void connectRepos(User user, List<GithubRepoDto> repos) {
        for (GithubRepoDto dto : repos) {
            RepositoryEntity repo = repositoryJpaRepository
                    .findByGithubRepoId(dto.githubRepoId())
                    .orElseGet(() -> repositoryJpaRepository.save(
                            RepositoryEntity.builder()
                                    .githubRepoId(dto.githubRepoId())
                                    .ownerGithubId(dto.ownerGithubId())
                                    .name(dto.name())
                                    .fullName(dto.fullName())
                                    .description(dto.description())
                                    .htmlUrl(dto.htmlUrl())
                                    .defaultBranch(dto.defaultBranch() != null ? dto.defaultBranch() : "main")
                                    .language(dto.language())
                                    .isPrivate(false)
                                    .build()
                    ));

            if (!userRepositoryJpaRepository.existsByUserIdAndRepositoryId(user.getId(), repo.getId())) {
                userRepositoryJpaRepository.save(
                        UserRepositoryEntity.builder()
                                .userId(user.getId())
                                .repositoryId(repo.getId())
                                .connectedAt(LocalDateTime.now())
                                .active(true)
                                .build()
                );
            }
        }
    }
}

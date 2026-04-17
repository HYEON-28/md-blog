package com.md_blog.demo.repo.service;

import com.md_blog.demo.repo.dto.ConnectedRepoResponse;
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
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RepoConnectService {

    private final RepositoryJpaRepository repositoryJpaRepository;
    private final UserRepositoryJpaRepository userRepositoryJpaRepository;
    private final GithubApiService githubApiService;

    @Transactional(readOnly = true)
    public List<ConnectedRepoResponse> getConnectedRepos(User user) {
        List<UserRepositoryEntity> links = userRepositoryJpaRepository.findByUserIdAndActiveTrue(user.getId());
        if (links.isEmpty()) return List.of();

        Set<java.util.UUID> repoIds = links.stream()
                .map(UserRepositoryEntity::getRepositoryId)
                .collect(Collectors.toSet());

        List<RepositoryEntity> repos = repositoryJpaRepository.findAllById(repoIds);

        Set<Long> githubRepoIds = repos.stream()
                .map(RepositoryEntity::getGithubRepoId)
                .collect(Collectors.toSet());

        Map<Long, String> pushedAtMap = githubApiService
                .getReposByIds(user.getAccessToken(), githubRepoIds)
                .stream()
                .collect(Collectors.toMap(
                        GithubRepoDto.GithubApiResponse::id,
                        r -> toRelativeTime(r.pushedAt())
                ));

        return repos.stream()
                .map(r -> new ConnectedRepoResponse(
                        r.getGithubRepoId(),
                        r.getName(),
                        r.getDescription(),
                        r.getLanguage(),
                        r.getHtmlUrl(),
                        pushedAtMap.getOrDefault(r.getGithubRepoId(), "")
                ))
                .toList();
    }

    private String toRelativeTime(String iso8601) {
        if (iso8601 == null || iso8601.isBlank()) return "";
        OffsetDateTime pushed = OffsetDateTime.parse(iso8601);
        OffsetDateTime now = OffsetDateTime.now(java.time.ZoneOffset.UTC);
        long minutes = ChronoUnit.MINUTES.between(pushed, now);
        if (minutes < 1) return "방금 전";
        if (minutes < 60) return minutes + "분 전";
        long hours = ChronoUnit.HOURS.between(pushed, now);
        if (hours < 24) return hours + "시간 전";
        long days = ChronoUnit.DAYS.between(pushed, now);
        if (days == 1) return "어제";
        if (days < 7) return days + "일 전";
        long weeks = days / 7;
        if (weeks < 5) return weeks + "주 전";
        long months = ChronoUnit.MONTHS.between(pushed, now);
        if (months < 12) return months + "개월 전";
        return ChronoUnit.YEARS.between(pushed, now) + "년 전";
    }

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

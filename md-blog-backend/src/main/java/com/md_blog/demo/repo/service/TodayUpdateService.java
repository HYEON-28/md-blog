package com.md_blog.demo.repo.service;

import com.md_blog.demo.repo.dto.TodayUpdateResponse;
import com.md_blog.demo.repo.entity.RepositoryEntity;
import com.md_blog.demo.repo.repository.RepositoryJpaRepository;
import com.md_blog.demo.user.entity.User;
import com.md_blog.demo.user.entity.UserRepositoryEntity;
import com.md_blog.demo.user.repository.UserRepositoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodayUpdateService {

    private final GithubApiService githubApiService;
    private final UserRepositoryJpaRepository userRepositoryJpaRepository;
    private final RepositoryJpaRepository repositoryJpaRepository;

    public List<TodayUpdateResponse> getTodayUpdates(User user) {
        // 오늘 00:00 UTC (ISO 8601)
        String since = LocalDate.now(ZoneOffset.UTC)
                .atStartOfDay(ZoneOffset.UTC)
                .format(DateTimeFormatter.ISO_INSTANT);

        List<UserRepositoryEntity> links =
                userRepositoryJpaRepository.findByUserIdAndActiveTrue(user.getId());
        if (links.isEmpty()) return List.of();

        Set<UUID> repoIds = links.stream()
                .map(UserRepositoryEntity::getRepositoryId)
                .collect(Collectors.toSet());

        List<RepositoryEntity> repos = repositoryJpaRepository.findAllById(repoIds);

        List<TodayUpdateResponse> result = new ArrayList<>();

        for (RepositoryEntity repo : repos) {
            List<GithubApiService.CommitSummary> commits =
                    githubApiService.getTodayCommits(user.getAccessToken(), repo.getFullName(), since);

            if (commits.isEmpty()) continue;

            // 파일별 집계: 가장 최근 커밋 기준으로 상태·메시지·시각, additions/deletions 합산
            // commits는 newest-first 순서로 반환됨
            Map<String, FileAgg> fileMap = new LinkedHashMap<>();

            for (GithubApiService.CommitSummary summary : commits) {
                GithubApiService.CommitDetail detail =
                        githubApiService.getCommitDetail(user.getAccessToken(), repo.getFullName(), summary.sha());

                if (detail == null || detail.files() == null) continue;

                String commitMsg = firstLine(summary.commit().message());
                String commitTime = toHhmm(summary.commit().author().date());

                for (GithubApiService.CommitDetail.FileChange fc : detail.files()) {
                    fileMap.merge(
                            fc.filename(),
                            new FileAgg(fc.filename(), fc.status(), commitMsg, fc.additions(), fc.deletions(), commitTime),
                            (existing, incoming) -> new FileAgg(
                                    existing.filename(),
                                    existing.status(),       // 가장 최근(first) 상태 유지
                                    existing.commitMessage(),
                                    existing.additions() + incoming.additions(),
                                    existing.deletions() + incoming.deletions(),
                                    existing.time()
                            )
                    );
                }
            }

            if (fileMap.isEmpty()) continue;

            int totalAdd = fileMap.values().stream().mapToInt(FileAgg::additions).sum();
            int totalDel = fileMap.values().stream().mapToInt(FileAgg::deletions).sum();

            List<TodayUpdateResponse.FileChange> files = fileMap.values().stream()
                    .map(a -> new TodayUpdateResponse.FileChange(
                            a.filename(),
                            toChangeType(a.status()),
                            a.commitMessage(),
                            a.additions(),
                            a.deletions(),
                            a.time()
                    ))
                    .toList();

            result.add(new TodayUpdateResponse(repo.getName(), repo.getLanguage(), totalAdd, totalDel, files));
        }

        return result;
    }

    private record FileAgg(
            String filename,
            String status,
            String commitMessage,
            int additions,
            int deletions,
            String time
    ) {}

    private static String toChangeType(String status) {
        return switch (status) {
            case "added" -> "added";
            case "removed" -> "deleted";
            default -> "modified";  // modified, renamed, copied, changed
        };
    }

    private static String firstLine(String message) {
        if (message == null) return "";
        int nl = message.indexOf('\n');
        return nl > 0 ? message.substring(0, nl) : message;
    }

    private static String toHhmm(String isoDate) {
        if (isoDate == null || isoDate.length() < 16) return "";
        // "2026-04-19T09:14:00Z" → "09:14"
        return isoDate.substring(11, 16);
    }
}

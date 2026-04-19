package com.md_blog.demo.repo.service;

import com.md_blog.demo.repo.dto.FileDetailResponse;
import com.md_blog.demo.repo.dto.TodayUpdateResponse;
import com.md_blog.demo.repo.entity.RepositoryEntity;
import com.md_blog.demo.repo.repository.RepositoryJpaRepository;
import com.md_blog.demo.user.entity.User;
import com.md_blog.demo.user.entity.UserRepositoryEntity;
import com.md_blog.demo.user.repository.UserRepositoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
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
        String since = todaySeoulMidnightUtc();

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
                                    existing.status(),
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

            result.add(new TodayUpdateResponse(repo.getName(), repo.getFullName(), repo.getLanguage(), totalAdd, totalDel, files));
        }

        return result;
    }

    public FileDetailResponse getFileDetail(User user, String repoFullName, String filePath) {
        String since = todaySeoulMidnightUtc();

        List<GithubApiService.CommitSummary> commits =
                githubApiService.getFileCommits(user.getAccessToken(), repoFullName, since, filePath);

        if (commits.isEmpty()) {
            return new FileDetailResponse(filePath, repoFullName, 0, 0, List.of());
        }

        List<FileDetailResponse.CommitWithPatch> result = new ArrayList<>();
        int totalAdd = 0, totalDel = 0;

        for (int i = 0; i < commits.size(); i++) {
            GithubApiService.CommitSummary summary = commits.get(i);
            GithubApiService.CommitDetail detail =
                    githubApiService.getCommitDetail(user.getAccessToken(), repoFullName, summary.sha());

            if (detail == null || detail.files() == null) continue;

            GithubApiService.CommitDetail.FileChange fc = detail.files().stream()
                    .filter(f -> f.filename().equals(filePath))
                    .findFirst()
                    .orElse(null);

            if (fc == null) continue;

            totalAdd += fc.additions();
            totalDel += fc.deletions();

            result.add(new FileDetailResponse.CommitWithPatch(
                    summary.sha(),
                    firstLine(summary.commit().message()),
                    toHhmm(summary.commit().author().date()),
                    fc.additions(),
                    fc.deletions(),
                    fc.patch(),
                    i == 0
            ));
        }

        return new FileDetailResponse(filePath, repoFullName, totalAdd, totalDel, result);
    }

    private static String todaySeoulMidnightUtc() {
        ZoneId seoul = ZoneId.of("Asia/Seoul");
        return LocalDate.now(seoul)
                .atStartOfDay(seoul)
                .toInstant()
                .toString();
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
            default -> "modified";
        };
    }

    private static String firstLine(String message) {
        if (message == null) return "";
        int nl = message.indexOf('\n');
        return nl > 0 ? message.substring(0, nl) : message;
    }

    private static String toHhmm(String isoDate) {
        if (isoDate == null || isoDate.isEmpty()) return "";
        return Instant.parse(isoDate)
                .atZone(ZoneId.of("Asia/Seoul"))
                .format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}

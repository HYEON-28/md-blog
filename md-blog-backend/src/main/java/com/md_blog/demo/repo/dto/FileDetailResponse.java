package com.md_blog.demo.repo.dto;

import java.util.List;

public record FileDetailResponse(
        String filePath,
        String repoFullName,
        int totalAdd,
        int totalDel,
        List<CommitWithPatch> commits
) {
    public record CommitWithPatch(
            String sha,
            String message,
            String time,
            int additions,
            int deletions,
            String patch,
            boolean latest
    ) {}
}

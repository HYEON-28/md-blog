package com.md_blog.demo.repo.dto;

import java.util.List;

public record TodayUpdateResponse(
        String repoName,
        String repoFullName,
        String language,
        int totalAdd,
        int totalDel,
        List<FileChange> files
) {
    public record FileChange(
            String filePath,
            String changeType,  // added | modified | deleted
            String commitMessage,
            int additions,
            int deletions,
            String time  // HH:mm
    ) {}
}

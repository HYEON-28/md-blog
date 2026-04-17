package com.md_blog.demo.repo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubRepoDto(
        Long githubRepoId,
        Long ownerGithubId,
        String name,
        String fullName,
        String description,
        String language,
        int stars,
        int forks,
        String updatedAt,
        String htmlUrl,
        String defaultBranch
) {
    public record Owner(Long id) {}

    public record GithubApiResponse(
            Long id,
            String name,
            @JsonProperty("full_name") String fullName,
            String description,
            String language,
            @JsonProperty("stargazers_count") int stargazersCount,
            @JsonProperty("forks_count") int forksCount,
            @JsonProperty("updated_at") String updatedAt,
            @JsonProperty("pushed_at") String pushedAt,
            @JsonProperty("private") boolean isPrivate,
            @JsonProperty("html_url") String htmlUrl,
            @JsonProperty("default_branch") String defaultBranch,
            Owner owner
    ) {}

    public static GithubRepoDto from(GithubApiResponse r) {
        return new GithubRepoDto(
                r.id(),
                r.owner() != null ? r.owner().id() : null,
                r.name(),
                r.fullName(),
                r.description(),
                r.language(),
                r.stargazersCount(),
                r.forksCount(),
                r.updatedAt(),
                r.htmlUrl(),
                r.defaultBranch()
        );
    }
}

package com.md_blog.demo.repo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubRepoDto(
        String name,
        String description,
        String language,
        int stars,
        int forks,
        String updatedAt
) {
    public record GithubApiResponse(
            String name,
            String description,
            String language,
            @JsonProperty("stargazers_count") int stargazersCount,
            @JsonProperty("forks_count") int forksCount,
            @JsonProperty("updated_at") String updatedAt,
            @JsonProperty("private") boolean isPrivate
    ) {}

    public static GithubRepoDto from(GithubApiResponse r) {
        return new GithubRepoDto(
                r.name(),
                r.description(),
                r.language(),
                r.stargazersCount(),
                r.forksCount(),
                r.updatedAt()
        );
    }
}

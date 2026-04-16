package com.md_blog.demo.repo.service;

import com.md_blog.demo.repo.dto.GithubRepoDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class GithubApiService {

    private final RestClient restClient;

    public GithubApiService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.github.com")
                .defaultHeader("Accept", "application/vnd.github.v3+json")
                .build();
    }

    public List<GithubRepoDto> getPublicRepos(String accessToken) {
        List<GithubRepoDto.GithubApiResponse> response = restClient.get()
                .uri("/user/repos?type=public&sort=updated&per_page=100")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null) return List.of();

        return response.stream()
                .filter(r -> !r.isPrivate())
                .map(GithubRepoDto::from)
                .toList();
    }
}

package com.md_blog.demo.repo.controller;

import com.md_blog.demo.repo.dto.GithubRepoDto;
import com.md_blog.demo.repo.service.GithubApiService;
import com.md_blog.demo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {

    private final GithubApiService githubApiService;

    @GetMapping("/public")
    public ResponseEntity<List<GithubRepoDto>> getPublicRepos(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<GithubRepoDto> repos = githubApiService.getPublicRepos(user.getAccessToken());
        return ResponseEntity.ok(repos);
    }
}

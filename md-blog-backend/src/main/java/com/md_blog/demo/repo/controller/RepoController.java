package com.md_blog.demo.repo.controller;

import com.md_blog.demo.repo.dto.ConnectReposRequest;
import com.md_blog.demo.repo.dto.ConnectedRepoResponse;
import com.md_blog.demo.repo.dto.DisconnectReposRequest;
import com.md_blog.demo.repo.dto.GithubRepoDto;
import com.md_blog.demo.repo.service.GithubApiService;
import com.md_blog.demo.repo.service.RepoConnectService;
import com.md_blog.demo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {

    private final GithubApiService githubApiService;
    private final RepoConnectService repoConnectService;

    @GetMapping("/connected")
    public ResponseEntity<List<ConnectedRepoResponse>> getConnectedRepos(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(repoConnectService.getConnectedRepos(user));
    }

    @GetMapping("/public")
    public ResponseEntity<List<GithubRepoDto>> getPublicRepos(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<GithubRepoDto> repos = githubApiService.getPublicRepos(user.getAccessToken());
        return ResponseEntity.ok(repos);
    }

    @PostMapping("/connect")
    public ResponseEntity<Void> connectRepos(
            @AuthenticationPrincipal User user,
            @RequestBody ConnectReposRequest request
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        repoConnectService.connectRepos(user, request.repos());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Void> disconnectRepos(
            @AuthenticationPrincipal User user,
            @RequestBody DisconnectReposRequest request
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        repoConnectService.disconnectRepos(user, request.githubRepoIds());
        return ResponseEntity.ok().build();
    }
}

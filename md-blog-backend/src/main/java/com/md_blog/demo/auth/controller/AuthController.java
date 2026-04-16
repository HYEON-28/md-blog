package com.md_blog.demo.auth.controller;

import com.md_blog.demo.auth.dto.UserResponse;
import com.md_blog.demo.user.entity.User;
import com.md_blog.demo.user.repository.UserRepositoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepositoryJpaRepository userRepositoryJpaRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @GetMapping("/has-linked-repo")
    public ResponseEntity<Map<String, Boolean>> hasLinkedRepo(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        boolean linked = userRepositoryJpaRepository.existsByUserIdAndActiveTrue(user.getId());
        return ResponseEntity.ok(Map.of("linked", linked));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT는 stateless이므로 서버에서 할 작업 없음 — 클라이언트가 토큰을 삭제
        return ResponseEntity.ok().build();
    }
}

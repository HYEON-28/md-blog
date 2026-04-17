package com.md_blog.demo.repo.dto;

import java.util.List;

public record DisconnectReposRequest(List<Long> githubRepoIds) {}

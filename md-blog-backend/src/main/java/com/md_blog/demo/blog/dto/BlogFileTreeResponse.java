package com.md_blog.demo.blog.dto;

import java.util.List;

public record BlogFileTreeResponse(
        String repoName,
        String repoFullName,
        List<FileTreeNode> children
) {
    public record FileTreeNode(
            String type,
            String name,
            String path,
            List<FileTreeNode> children
    ) {}
}

package com.example.moviewebapp.response;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String username;
    private Long reviewId;
    private LocalDateTime createdAt;
}
package com.example.moviewebapp.response;

import lombok.Builder;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponse {
    private Long id;
    private String content;
    private String username;
    private Long movieId;
    private LocalDateTime createdAt;
}
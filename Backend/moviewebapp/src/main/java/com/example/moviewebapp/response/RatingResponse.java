package com.example.moviewebapp.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RatingResponse {
    private Long movieId;
    private Integer userRating;
    private Double averageRating;
}
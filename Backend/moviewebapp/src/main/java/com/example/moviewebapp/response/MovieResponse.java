package com.example.moviewebapp.response;

import lombok.Builder;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;

@Getter
@Builder
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer durationMinutes;
    private String posterUrl;
    private List<String> genres;
    private List<String> actors;
    private List<String> directors;
    private Double averageRating;
}
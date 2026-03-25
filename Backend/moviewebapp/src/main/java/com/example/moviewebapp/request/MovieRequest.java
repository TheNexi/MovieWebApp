package com.example.moviewebapp.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class MovieRequest {
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer durationMinutes;
    private String posterUrl;
    private List<Long> genreIds;
    private List<Long> actorIds;
    private List<Long> directorIds;
}
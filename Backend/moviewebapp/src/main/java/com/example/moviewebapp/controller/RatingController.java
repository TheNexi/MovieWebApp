package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.RatingRequest;
import com.example.moviewebapp.response.RatingResponse;
import com.example.moviewebapp.service.RatingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/{movieId}")
    public ResponseEntity<RatingResponse> rateMovie(
            @PathVariable Long movieId,
            @RequestBody RatingRequest request,
            HttpServletRequest httpRequest) {

        return ratingService.rateMovie(movieId, request, httpRequest);
    }
}
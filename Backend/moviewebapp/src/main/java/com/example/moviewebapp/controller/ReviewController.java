package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.ReviewRequest;
import com.example.moviewebapp.response.ReviewResponse;
import com.example.moviewebapp.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{movieId}")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long movieId,
            @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {

        return reviewService.addReview(movieId, request, httpRequest);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewResponse>> getMovieReviews(
            @PathVariable Long movieId) {

        return reviewService.getMovieReviews(movieId);
    }
}
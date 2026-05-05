package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.RatingRequest;
import com.example.moviewebapp.request.ReviewRequest;
import com.example.moviewebapp.request.CommentRequest;
import com.example.moviewebapp.service.MovieService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllMovies() {
        return movieService.getAllMoviesResponse();
    }

    @GetMapping("/first/10")
    public ResponseEntity<?> getFirst10Movies() {
        return movieService.getFirstMoviesResponse(10);
    }

    @GetMapping("/first/100")
    public ResponseEntity<?> getFirst100Movies() {
        return movieService.getFirstMoviesResponse(100);
    }

    @GetMapping("/first/1000")
    public ResponseEntity<?> getFirst1000Movies() {
        return movieService.getFirstMoviesResponse(1000);
    }

    @GetMapping("/first/2500")
    public ResponseEntity<?> getFirst2500Movies() {
        return movieService.getFirstMoviesResponse(2500);
    }

    @GetMapping("/first/5000")
    public ResponseEntity<?> getFirst5000Movies() {
        return movieService.getFirstMoviesResponse(5000);
    }

    @GetMapping("/first/10000")
    public ResponseEntity<?> getFirst10000Movies() {
        return movieService.getFirstMoviesResponse(10000);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        return movieService.getMovieByIdResponse(id);
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateMovie(
            @PathVariable Long id,
            @RequestBody RatingRequest request,
            HttpServletRequest httpRequest) {

        return movieService.addRatingResponse(id, request.getRating(), httpRequest);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {

        return movieService.addReviewResponse(id, request.getContent(), httpRequest);
    }

    @PostMapping("/review/{reviewId}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable Long reviewId,
            @RequestBody CommentRequest request,
            HttpServletRequest httpRequest) {

        return movieService.addCommentResponse(reviewId, request.getContent(), httpRequest);
    }

    @GetMapping("/{id}/cast")
    public ResponseEntity<?> getCast(@PathVariable Long id) {
        return movieService.getCastResponse(id);
    }
}
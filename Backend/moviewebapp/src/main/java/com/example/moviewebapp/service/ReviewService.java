package com.example.moviewebapp.service;

import com.example.moviewebapp.model.Movie;
import com.example.moviewebapp.model.Review;
import com.example.moviewebapp.model.User;
import com.example.moviewebapp.repository.MovieRepository;
import com.example.moviewebapp.repository.ReviewRepository;
import com.example.moviewebapp.request.ReviewRequest;
import com.example.moviewebapp.response.ReviewResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository,
                         MovieRepository movieRepository,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.userService = userService;
    }

    public ResponseEntity<ReviewResponse> addReview(
            Long movieId,
            ReviewRequest request,
            HttpServletRequest httpRequest) {

        User user = userService.getUserFromRequest(httpRequest);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Review review = reviewRepository
                .findByUserIdAndMovieId(user.getId(), movieId)
                .orElse(null);

        if (review != null) {
            review.setContent(request.getContent());
        } else {
            review = Review.builder()
                    .content(request.getContent())
                    .user(user)
                    .movie(movie)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        reviewRepository.save(review);

        return ResponseEntity.ok(mapToResponse(review));
    }

    public ResponseEntity<List<ReviewResponse>> getMovieReviews(Long movieId) {

        List<ReviewResponse> reviews = reviewRepository.findByMovieId(movieId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(reviews);
    }

    private ReviewResponse mapToResponse(Review review) {

        return ReviewResponse.builder()
                .id(review.getId())
                .content(review.getContent())
                .username(review.getUser().getUsername())
                .movieId(review.getMovie().getId())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
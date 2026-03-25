package com.example.moviewebapp.service;

import com.example.moviewebapp.model.*;
import com.example.moviewebapp.repository.*;
import com.example.moviewebapp.request.MovieRequest;
import com.example.moviewebapp.response.MovieResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    public MovieService(MovieRepository movieRepository,
                        RatingRepository ratingRepository,
                        ReviewRepository reviewRepository,
                        CommentRepository commentRepository,
                        UserService userService) {

        this.movieRepository = movieRepository;
        this.ratingRepository = ratingRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
    }

    public ResponseEntity<?> getAllMoviesResponse() {

        List<MovieResponse> movies = movieRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(movies);
    }

    public ResponseEntity<?> getMovieByIdResponse(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return ResponseEntity.ok(mapToResponse(movie));
    }

    public ResponseEntity<?> addMovieResponse(MovieRequest request) {

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .releaseDate(request.getReleaseDate())
                .durationMinutes(request.getDurationMinutes())
                .posterUrl(request.getPosterUrl())
                .build();

        movieRepository.save(movie);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToResponse(movie));
    }

    public ResponseEntity<?> addRatingResponse(Long movieId,
                                               Integer ratingValue,
                                               HttpServletRequest request) {

        User user = userService.getUserFromRequest(request);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (ratingRepository.findByUserIdAndMovieId(user.getId(), movieId).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("You already rated this movie");
        }

        Rating rating = Rating.builder()
                .rating(ratingValue)
                .user(user)
                .movie(movie)
                .createdAt(LocalDateTime.now())
                .build();

        ratingRepository.save(rating);

        return ResponseEntity.ok("Rating added");
    }

    public ResponseEntity<?> addReviewResponse(Long movieId,
                                               String reviewContent,
                                               HttpServletRequest request) {

        User user = userService.getUserFromRequest(request);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (reviewRepository.findByUserIdAndMovieId(user.getId(), movieId).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Review already exists");
        }

        Review review = Review.builder()
                .content(reviewContent)
                .user(user)
                .movie(movie)
                .createdAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);

        return ResponseEntity.ok("Review added");
    }

    public ResponseEntity<?> addCommentResponse(Long reviewId,
                                                String commentContent,
                                                HttpServletRequest request) {

        User user = userService.getUserFromRequest(request);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Comment comment = Comment.builder()
                .content(commentContent)
                .user(user)
                .review(review)
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        return ResponseEntity.ok("Comment added");
    }

    public ResponseEntity<?> getCastResponse(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return ResponseEntity.ok(
                movie.getActors()
                        .stream()
                        .map(Actor::getName)
                        .toList()
        );
    }

    private MovieResponse mapToResponse(Movie movie) {

        double avgRating = movie.getRatings()
                .stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .durationMinutes(movie.getDurationMinutes())
                .posterUrl(movie.getPosterUrl())
                .genres(movie.getGenres().stream().map(Genre::getName).toList())
                .actors(movie.getActors().stream().map(Actor::getName).toList())
                .directors(movie.getDirectors().stream().map(Director::getName).toList())
                .averageRating(avgRating)
                .build();
    }
}
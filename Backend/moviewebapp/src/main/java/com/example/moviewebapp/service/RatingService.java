package com.example.moviewebapp.service;

import com.example.moviewebapp.model.Movie;
import com.example.moviewebapp.model.Rating;
import com.example.moviewebapp.model.User;
import com.example.moviewebapp.repository.MovieRepository;
import com.example.moviewebapp.repository.RatingRepository;
import com.example.moviewebapp.request.RatingRequest;
import com.example.moviewebapp.response.RatingResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserService userService;

    public RatingService(RatingRepository ratingRepository,
                         MovieRepository movieRepository,
                         UserService userService) {
        this.ratingRepository = ratingRepository;
        this.movieRepository = movieRepository;
        this.userService = userService;
    }

    public ResponseEntity<RatingResponse> rateMovie(
            Long movieId,
            RatingRequest request,
            HttpServletRequest httpRequest) {

        User user = userService.getUserFromRequest(httpRequest);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Rating rating = ratingRepository
                .findByUserIdAndMovieId(user.getId(), movieId)
                .orElse(null);

        if (rating != null) {
            rating.setRating(request.getRating());
            ratingRepository.save(rating);
        } else {
            rating = Rating.builder()
                    .rating(request.getRating())
                    .user(user)
                    .movie(movie)
                    .createdAt(LocalDateTime.now())
                    .build();

            ratingRepository.save(rating);
        }

        double avg = movie.getRatings()
                .stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        return ResponseEntity.ok(
                RatingResponse.builder()
                        .movieId(movieId)
                        .userRating(rating.getRating())
                        .averageRating(avg)
                        .build()
        );
    }
}
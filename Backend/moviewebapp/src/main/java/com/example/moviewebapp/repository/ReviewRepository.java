package com.example.moviewebapp.repository;

import com.example.moviewebapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByUserIdAndMovieId(Long userId, Long movieId);
    List<Review> findByMovieId(Long movieId);
}
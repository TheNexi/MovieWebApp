package com.example.moviewebapp.repository;

import com.example.moviewebapp.model.Movie;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    @EntityGraph(attributePaths = {
            "genres",
            "actors",
            "directors",
            "ratings"
    })
    List<Movie> findAllBy(Pageable pageable);
}
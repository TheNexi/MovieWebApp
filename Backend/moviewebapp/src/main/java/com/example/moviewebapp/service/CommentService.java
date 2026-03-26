package com.example.moviewebapp.service;

import com.example.moviewebapp.model.Comment;
import com.example.moviewebapp.model.Review;
import com.example.moviewebapp.model.User;
import com.example.moviewebapp.repository.CommentRepository;
import com.example.moviewebapp.repository.ReviewRepository;
import com.example.moviewebapp.request.CommentRequest;
import com.example.moviewebapp.response.CommentResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserService userService;

    public CommentService(CommentRepository commentRepository,
                          ReviewRepository reviewRepository,
                          UserService userService) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
        this.userService = userService;
    }

    public ResponseEntity<CommentResponse> addComment(
            Long reviewId,
            CommentRequest request,
            HttpServletRequest httpRequest) {

        User user = userService.getUserFromRequest(httpRequest);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .review(review)
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        return ResponseEntity.ok(mapToResponse(comment));
    }

    public ResponseEntity<List<CommentResponse>> getCommentsByReview(Long reviewId) {

        List<CommentResponse> comments = commentRepository.findByReviewId(reviewId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(comments);
    }

    private CommentResponse mapToResponse(Comment comment) {

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .reviewId(comment.getReview().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
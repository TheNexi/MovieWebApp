package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.CommentRequest;
import com.example.moviewebapp.response.CommentResponse;
import com.example.moviewebapp.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{reviewId}")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long reviewId,
            @RequestBody CommentRequest request,
            HttpServletRequest httpRequest) {

        return commentService.addComment(reviewId, request, httpRequest);
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long reviewId) {

        return commentService.getCommentsByReview(reviewId);
    }
}
package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.UserRequest;
import com.example.moviewebapp.response.UserResponse;
import com.example.moviewebapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/edit")
    public ResponseEntity<UserResponse> editUser(
            @RequestBody UserRequest request,
            HttpServletRequest httpRequest) {

        return userService.editUserResponse(request, httpRequest);
    }

    @GetMapping("/favourites")
    public ResponseEntity<UserResponse> getFavouriteMovies(
            HttpServletRequest request) {

        return userService.getFavouriteMoviesResponse(request);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserDetails(
            HttpServletRequest request) {

        return userService.getUserDetailsResponse(request);
    }
}
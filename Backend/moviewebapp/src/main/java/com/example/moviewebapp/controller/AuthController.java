package com.example.moviewebapp.controller;

import com.example.moviewebapp.request.UserRequest;
import com.example.moviewebapp.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/is-authorized")
    public ResponseEntity<?> isAuthorized() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserRequest request,
            HttpServletResponse response) {

        return authService.login(request, response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody UserRequest request) {

        return authService.register(request);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        return authService.refreshTokens(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletResponse response) {

        return authService.logout(response);
    }
}
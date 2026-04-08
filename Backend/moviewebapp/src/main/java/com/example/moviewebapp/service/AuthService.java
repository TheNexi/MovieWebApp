package com.example.moviewebapp.service;

import com.example.moviewebapp.model.User;
import com.example.moviewebapp.repository.UserRepository;
import com.example.moviewebapp.request.UserRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
            TokenService tokenService,
            CookieService cookieService,
            AuthenticationManager authenticationManager,
            UserService userService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    public ResponseEntity<?> login(UserRequest userRequest,
            HttpServletResponse response) {
        try {

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userRequest.getUsername(),
                    userRequest.getPassword());

            authenticationManager.authenticate(auth);

            tokenService.addTokensToResponse(userRequest.getUsername(), response);

            return ResponseEntity.ok(userRequest.getUsername());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Login failed");
        }
    }

    public ResponseEntity<?> register(UserRequest userRequest) {
        try {

            if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Username already exists");
            }

            User user = User.builder()
                    .username(userRequest.getUsername())
                    .password(userService.hashPassword(userRequest.getPassword()))
                    .avatarPath(userRequest.getAvatarPath())
                    .build();

            userRepository.save(user);

            return ResponseEntity.ok("User registered");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Register failed");
        }
    }

    public ResponseEntity<?> refreshTokens(HttpServletRequest request,
            HttpServletResponse response) {
        try {

            Cookie[] cookies = request.getCookies();

            String refreshToken = cookieService.getTokenFromCookies(cookies, "REFRESH_TOKEN");

            if (refreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Refresh token missing");
            }

            String username = tokenService.getUsernameFromToken(refreshToken);

            tokenService.addTokensToResponse(username, response);

            return ResponseEntity.ok("Tokens refreshed");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Refresh failed");
        }
    }

    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {

            Cookie access = cookieService.createCookie(
                    "ACCESS_TOKEN", "", 0);

            Cookie refresh = cookieService.createCookie(
                    "REFRESH_TOKEN", "", 0);

            response.addCookie(access);
            response.addCookie(refresh);

            return ResponseEntity.ok("Logged out");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Logout failed");
        }
    }

    private User getUserFromDatabase(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
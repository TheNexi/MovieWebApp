package com.example.moviewebapp.service;

import com.example.moviewebapp.model.User;
import com.example.moviewebapp.request.UserRequest;
import com.example.moviewebapp.response.UserResponse;
import com.example.moviewebapp.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public User getUserFromRequest(HttpServletRequest request) {
        String username = (String) request.getAttribute("username");

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ResponseEntity<UserResponse> editUserResponse(
            UserRequest request,
            HttpServletRequest httpRequest) {

        User user = getUserFromRequest(httpRequest);

        user.setUsername(request.getUsername());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user.setAvatarPath(request.getAvatarPath());

        userRepository.save(user);

        return ResponseEntity.ok(mapToResponse(user));
    }

    public ResponseEntity<UserResponse> getFavouriteMoviesResponse(
            HttpServletRequest request) {

        User user = getUserFromRequest(request);

        return ResponseEntity.ok(mapToResponse(user));
    }

    public ResponseEntity<UserResponse> getUserDetailsResponse(
            HttpServletRequest request) {

        User user = getUserFromRequest(request);

        return ResponseEntity.ok(mapToResponse(user));
    }

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarPath(user.getAvatarPath())
                .build();
    }
}
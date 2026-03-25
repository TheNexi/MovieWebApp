package com.example.moviewebapp.service;

import com.example.moviewebapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class ValidationService {

    private final UserRepository userRepository;

    public ValidationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isUserValid(String username, String password) {

        return isUsernameValid(username)
                && isPasswordValid(password)
                && isUsernameFree(username);
    }

    public boolean isUsernameValid(String username) {
        return username != null
                && username.length() >= 4
                && username.length() <= 20;
    }

    public boolean isPasswordValid(String password) {

        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$";

        return password != null && Pattern.matches(pattern, password);
    }

    public boolean isUsernameFree(String username) {
        return userRepository.findByUsername(username).isEmpty();
    }

    public boolean isCommentValid(String content) {
        return content != null
                && content.length() >= 3
                && content.length() <= 500;
    }

    public boolean isReviewValid(String content) {
        return content != null
                && content.length() >= 10
                && content.length() <= 5000;
    }

    public boolean isRatingValid(Integer rating) {
        return rating != null
                && rating >= 1
                && rating <= 10;
    }
}
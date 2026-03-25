package com.example.moviewebapp.service;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    public Cookie createCookie(String name, String value, long maxAgeMillis) {

        Cookie cookie = new Cookie(name, value);

        cookie.setHttpOnly(true);
        cookie.setPath("/");

        cookie.setSecure(false);

        cookie.setMaxAge((int) (maxAgeMillis / 1000));

        cookie.setAttribute("SameSite", "Lax");

        return cookie;
    }

    public String getTokenFromCookies(Cookie[] cookies, String name) {

        if (cookies == null) return null;

        for (Cookie c : cookies) {
            if (c.getName().equals(name)) {
                return c.getValue();
            }
        }
        return null;
    }
}
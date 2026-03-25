package com.example.moviewebapp.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration;

    private final CookieService cookieService;

    public TokenService(CookieService cookieService) {
        this.cookieService = cookieService;
    }

    public String generateAccessToken(String username) {
        return generateToken(username, false);
    }

    public String generateRefreshToken(String username) {
        return generateToken(username, true);
    }

    private String generateToken(String username, boolean isRefresh) {

        long expirationTime = isRefresh ? refreshExpiration : accessExpiration;

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Date getExpirationFromToken(String token) {
        return getClaims(token).getExpiration();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public void addTokensToResponse(String username, HttpServletResponse response) {

        String accessToken = generateAccessToken(username);
        String refreshToken = generateRefreshToken(username);

        Cookie accessCookie = cookieService.createCookie(
                "ACCESS_TOKEN",
                accessToken,
                accessExpiration
        );

        Cookie refreshCookie = cookieService.createCookie(
                "REFRESH_TOKEN",
                refreshToken,
                refreshExpiration
        );

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
    }

    private SecretKey getSignKey() {
        return new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
    }
}
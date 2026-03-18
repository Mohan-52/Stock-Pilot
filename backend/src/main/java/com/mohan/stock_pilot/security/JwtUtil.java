package com.mohan.stock_pilot.security;

import com.mohan.stock_pilot.auth.entity.Roles;
import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret.access}")
    private String ACCESS_TOKEN_SECRET;

    @Value("${jwt.secret.refresh}")
    private String REFRESH_TOKEN_SECRET;

    @Value("${jwt.expiration.access}")
    private Long ACCESS_EXPIRATION;

    @Value("${jwt.expiration.refresh}")
    private Long REFRESH_EXPIRATION;


    public SecretKey getSigningKey(String secret){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(StockPilotUser user){
        return Jwts.builder()
                .subject(user.getEmail())
                .issuer("STOCK_PILOT")
                .claim("fullName", user.getFullName())
                .claim("roles", user.getRole().getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ACCESS_EXPIRATION))
                .signWith(getSigningKey(ACCESS_TOKEN_SECRET), SignatureAlgorithm.HS256)
                .compact();

    }
    
    public String generateRefreshToken(StockPilotUser user){
        return Jwts.builder()
                .issuer("STOCK_PILOT")
                .subject(user.getEmail())
                .signWith(getSigningKey(REFRESH_TOKEN_SECRET), SignatureAlgorithm.HS256)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+REFRESH_EXPIRATION)).compact();
    }

    private Claims extractClaimsFromAccessToken(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey(ACCESS_TOKEN_SECRET))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token){
        return extractClaimsFromAccessToken(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email.equals(userDetails.getUsername());
    }

}

package com.mohan.stock_pilot.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message=(String) request.getAttribute("exception");

        Map<String, Object> body=new HashMap<>();
        body.put("timeStamp", LocalDateTime.now());
        body.put("status",401);
        body.put("error", HttpStatus.UNAUTHORIZED.getReasonPhrase());
        body.put("message",message);
        body.put("path",request.getRequestURI());

        objectMapper.writeValue(response.getOutputStream(), body);


    }
}

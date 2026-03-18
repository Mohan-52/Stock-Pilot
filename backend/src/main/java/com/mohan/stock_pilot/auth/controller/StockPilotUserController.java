package com.mohan.stock_pilot.auth.controller;

import com.mohan.stock_pilot.auth.dto.*;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import com.mohan.stock_pilot.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class StockPilotUserController {

    private final IStockPilotUserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequestDto requestDto){
        userService.registerUser(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("User registered successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto, HttpServletResponse response){
        LoginResultDto resultDto= userService.login(requestDto);
        ResponseCookie cookie=ResponseCookie.from("refreshToken",resultDto.refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/auth/refresh")
                .maxAge(15*24*60*60)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new LoginResponseDto(resultDto.userId(),resultDto.accessToken()));
    }
}

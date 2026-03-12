package com.mohan.stock_pilot.auth.controller;

import com.mohan.stock_pilot.auth.dto.RegisterRequestDto;
import com.mohan.stock_pilot.auth.dto.VerifyEmailRequestDto;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import com.mohan.stock_pilot.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class StockPilotUserController {

    private final IStockPilotUserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequestDto requestDto){
        userService.registerUser(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("User registered successfully. Please verify your email."));
    }

    @PostMapping("/verify-otp")
   public ResponseEntity<ApiResponse> verifyOtp(@RequestBody VerifyEmailRequestDto request){
       userService.verifyEmail(request.email(), request.otp());

       return ResponseEntity.ok(new ApiResponse("Email Successfully Verified"));
    }
}

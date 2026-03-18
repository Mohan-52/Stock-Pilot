package com.mohan.stock_pilot.auth.controller;

import com.mohan.stock_pilot.auth.dto.VerifyEmailRequestDto;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.common.dto.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/registration")
@AllArgsConstructor
public class OtpController {
    private final IOtpService service;

    @PostMapping(value = {"/otp/send","/otp/resend"})
    public ResponseEntity<ApiResponse> resendOtp(@RequestParam("email") String email){
        service.generateAndSendOtp(email);
        return  ResponseEntity.ok(new ApiResponse("OTP Successfully Sent"));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody VerifyEmailRequestDto request){
        service.verifyOtp(request.email(), request.otp());
        return ResponseEntity.ok(new ApiResponse("Email Successfully Verified"));
    }

}

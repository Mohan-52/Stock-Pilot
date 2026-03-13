package com.mohan.stock_pilot.auth.service;


import com.mohan.stock_pilot.auth.dto.RegisterRequestDto;

public interface IStockPilotUserService {
    void registerUser(RegisterRequestDto requestDto);
    void verifyEmail(String email, String otp);
    void resendOtp(String email);
}

package com.mohan.stock_pilot.auth.service;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;

public interface IOtpService {
    void generateAndSendOtp(String email);
    boolean verifyOtp(String email, String otp);
}

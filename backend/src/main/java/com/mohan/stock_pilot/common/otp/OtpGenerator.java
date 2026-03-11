package com.mohan.stock_pilot.common.otp;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpGenerator {
    public String generateOtp(){
        int otp=new Random().nextInt(900000)+100000;
        return String.valueOf(otp);
    }
}

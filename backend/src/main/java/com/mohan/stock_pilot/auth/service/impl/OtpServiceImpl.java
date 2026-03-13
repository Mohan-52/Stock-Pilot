package com.mohan.stock_pilot.auth.service.impl;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.auth.event.SendOtpEvent;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.common.otp.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements IOtpService {
    private final RedisTemplate<String, String> redisTemplate;
    private final OtpGenerator otpGenerator;
    private final ApplicationEventPublisher eventPublisher;

    public void generateAndSendOtp(StockPilotUser user) {

        String otp = otpGenerator.generateOtp();

        String key = "email_verification:" + user.getId();

        redisTemplate.opsForValue()
                .set(key, otp, Duration.ofMinutes(5));

       eventPublisher.publishEvent(new SendOtpEvent(user.getEmail(), otp));
    }

    public boolean verifyOtp(StockPilotUser user, String otp) {
        String key="email_verification:"+user.getId();
        String storedOtp=redisTemplate.opsForValue().get(key);

        if(storedOtp==null || !storedOtp.equals(otp))  return false;

        redisTemplate.delete(key);
        return true;

    }
}

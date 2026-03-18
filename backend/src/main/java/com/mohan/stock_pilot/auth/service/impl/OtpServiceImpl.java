package com.mohan.stock_pilot.auth.service.impl;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.auth.event.SendOtpEvent;
import com.mohan.stock_pilot.auth.repository.StockPilotUserRepository;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.otp.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements IOtpService {

    private final RedisTemplate<String, String> redisTemplate;
    private final OtpGenerator otpGenerator;
    private final ApplicationEventPublisher eventPublisher;
    private final StockPilotUserRepository userRepository;

    public void generateAndSendOtp(String email) {

        if(userRepository.existsByEmail(email)){
            throw new ResourceAlreadyExistsEx("Email Already exists in the database try other email");
        }

        String otp = otpGenerator.generateOtp();

        String key = "email_verification:" + email;

        redisTemplate.opsForValue()
                .set(key, otp, Duration.ofMinutes(5));

       eventPublisher.publishEvent(new SendOtpEvent(email, otp));
    }

    public boolean verifyOtp(String email, String otp) {
        String key="email_verification:"+email;
        String storedOtp=redisTemplate.opsForValue().get(key);

        if(storedOtp==null || !storedOtp.equals(otp))  return false;

        redisTemplate.opsForValue().set("verified_email:"+email,"true",Duration.ofMinutes(10));
        redisTemplate.delete(key);
        return true;

    }
}

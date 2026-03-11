package com.mohan.stock_pilot.auth.service.impl;

import com.mohan.stock_pilot.auth.dto.RegisterRequestDto;
import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.auth.repository.StockPilotUserRepository;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockPilotUserServiceImpl implements IStockPilotUserService{

    private final StockPilotUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IOtpService otpService;

    @Override
    public void registerUser(RegisterRequestDto requestDto) {
        if(userRepository.existsByEmail(requestDto.email())){
            throw new RuntimeException("User Already Exists by email");
        }

        StockPilotUser user=new StockPilotUser();
        user.setEmail(requestDto.email());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setEmailVerified(false);

        StockPilotUser  stockPilotUser=userRepository.save(user);

        otpService.generateAndSendOtp(stockPilotUser);

    }


}

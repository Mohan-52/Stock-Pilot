package com.mohan.stock_pilot.auth.service.impl;

import com.mohan.stock_pilot.auth.dto.LoginRequestDto;
import com.mohan.stock_pilot.auth.dto.LoginResponseDto;
import com.mohan.stock_pilot.auth.dto.LoginResultDto;
import com.mohan.stock_pilot.auth.dto.RegisterRequestDto;
import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.auth.repository.StockPilotUserRepository;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import com.mohan.stock_pilot.common.exception.InvalidCredentialsEx;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockPilotUserServiceImpl implements IStockPilotUserService{

    private final StockPilotUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IOtpService otpService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;

    @Override
    public void registerUser(RegisterRequestDto requestDto) {

        String val=redisTemplate.opsForValue().get("verified_email:"+requestDto.email());

        if (!"true".equals(val)) {
            throw new InvalidCredentialsEx("Verify your otp to register");
        }

        StockPilotUser user=new StockPilotUser();
        user.setEmail(requestDto.email());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setEmailVerified(false);

        StockPilotUser  stockPilotUser=userRepository.save(user);


    }

    @Override
    public LoginResultDto login(LoginRequestDto requestDto) {

        Authentication auth;
        try{

            auth= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestDto.email(),requestDto.password()));

        }catch (Exception ex){
            throw new InvalidCredentialsEx("Invalid Email or Password");
        }

        CustomUserDetails principal = (CustomUserDetails) auth.getPrincipal();
        StockPilotUser user = principal.getUser();

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new LoginResultDto(user.getId(), accessToken,refreshToken);


    }


}

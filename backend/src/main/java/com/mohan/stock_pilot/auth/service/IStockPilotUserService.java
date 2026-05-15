package com.mohan.stock_pilot.auth.service;


import com.mohan.stock_pilot.auth.dto.LoginRequestDto;
import com.mohan.stock_pilot.auth.dto.LoginResultDto;
import com.mohan.stock_pilot.auth.dto.RegisterRequestDto;
import com.mohan.stock_pilot.auth.dto.UpdateProfileRequestDto;

import java.util.UUID;

public interface IStockPilotUserService {
    void registerUser(RegisterRequestDto requestDto);
    LoginResultDto login(LoginRequestDto requestDto);
    void updateProfile(UUID userId, UpdateProfileRequestDto requestDto);


}

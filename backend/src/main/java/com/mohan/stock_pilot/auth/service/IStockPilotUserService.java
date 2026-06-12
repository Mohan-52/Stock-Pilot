package com.mohan.stock_pilot.auth.service;


import com.mohan.stock_pilot.auth.dto.*;

import java.util.UUID;

public interface IStockPilotUserService {
    void registerUser(RegisterRequestDto requestDto);
    LoginResultDto login(LoginRequestDto requestDto);
    void updateProfile(UUID userId, UpdateProfileRequestDto requestDto);
    AccessTokenResponse refreshAccessToken(String refreshToken);


}

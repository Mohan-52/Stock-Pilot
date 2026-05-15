package com.mohan.stock_pilot.auth.service.impl;

import com.mohan.stock_pilot.auth.dto.*;
import com.mohan.stock_pilot.auth.entity.Roles;
import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.auth.enums.AccountStatus;
import com.mohan.stock_pilot.auth.enums.RoleType;
import com.mohan.stock_pilot.auth.repository.RolesRepository;
import com.mohan.stock_pilot.auth.repository.StockPilotUserRepository;
import com.mohan.stock_pilot.auth.service.IOtpService;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import com.mohan.stock_pilot.common.exception.InvalidCredentialsEx;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.common.service.CloudinaryService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.security.JwtUtil;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockPilotUserServiceImpl implements IStockPilotUserService{

    private final StockPilotUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;
    private final RolesRepository rolesRepository;
    private final IWalletService walletService;
    private final CloudinaryService cloudinaryService;

    @Override
    public void registerUser(RegisterRequestDto requestDto) {

        String val=redisTemplate.opsForValue().get("verified_email:"+requestDto.email());
        Roles roles=rolesRepository.findByName(RoleType.USER)
                .orElseThrow(()-> new ResourceNotFoundEx("User Not found"));


        if (!"true".equals(val)) {
            throw new InvalidCredentialsEx("Verify your otp to register");
        }

        StockPilotUser user=new StockPilotUser();
        user.setEmail(requestDto.email());
        user.setPassword(passwordEncoder.encode(requestDto.password()));
        user.setEmailVerified(true);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setRole(roles);

        StockPilotUser  stockPilotUser=userRepository.save(user);

        walletService.createWallet(stockPilotUser.getId());


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

        boolean profileCompleted = user.getFullName() != null;


        return new LoginResultDto(accessToken,refreshToken, profileCompleted);


    }

    @Override
    public void updateProfile(UUID userId, UpdateProfileRequestDto requestDto) {
        StockPilotUser user=userRepository.findById(userId).orElseThrow();

        user.setFullName(requestDto.fullName());

        if(requestDto.profilePhoto()!=null && !requestDto.profilePhoto().isEmpty()){
            String imageUrl= cloudinaryService.upload(requestDto.profilePhoto());
            user.setProfileImageUrl(imageUrl);
        }

        userRepository.save(user);
    }


}

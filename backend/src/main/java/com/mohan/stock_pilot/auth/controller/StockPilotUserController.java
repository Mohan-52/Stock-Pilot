package com.mohan.stock_pilot.auth.controller;

import com.mohan.stock_pilot.auth.dto.*;
import com.mohan.stock_pilot.auth.service.IStockPilotUserService;
import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class StockPilotUserController {

    private final IStockPilotUserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequestDto requestDto){
        userService.registerUser(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("User registered successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto, HttpServletResponse response){
        LoginResultDto resultDto= userService.login(requestDto);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", resultDto.refreshToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(15 * 24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new LoginResponseDto(resultDto.accessToken(), resultDto.profileCompleted()));
    }

    @PutMapping(value = "/profile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> updateProfile(@ModelAttribute UpdateProfileRequestDto requestDto, @AuthenticationPrincipal CustomUserDetails userDetails){
         userService.updateProfile(userDetails.getUser().getId(), requestDto);

         ApiResponse response=new ApiResponse("Profile Successfully Updated");
         return ResponseEntity.ok(response);
    }
}

package com.mohan.stock_pilot.auth.dto;


public record LoginResultDto( String accessToken, String refreshToken, boolean profileCompleted) {
}

package com.mohan.stock_pilot.auth.dto;

import java.util.UUID;

public record LoginResponseDto(String accessToken, boolean profileCompleted) {
}

package com.mohan.stock_pilot.auth.dto;

import java.util.UUID;

public record LoginResponseDto(UUID userId, String accessToken) {
}

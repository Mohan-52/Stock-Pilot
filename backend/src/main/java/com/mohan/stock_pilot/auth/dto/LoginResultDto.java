package com.mohan.stock_pilot.auth.dto;

import java.util.UUID;

public record LoginResultDto(UUID userId, String accessToken, String refreshToken) {
}

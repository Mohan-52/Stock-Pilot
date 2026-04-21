package com.mohan.stock_pilot.wallet.dto;

import java.util.UUID;

public record DebitRequestDto(UUID userId, long amount) {
}

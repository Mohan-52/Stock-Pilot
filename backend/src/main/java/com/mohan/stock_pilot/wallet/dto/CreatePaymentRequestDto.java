package com.mohan.stock_pilot.wallet.dto;

import java.util.UUID;

public record CreatePaymentRequestDto(long amount, UUID userId) {
}

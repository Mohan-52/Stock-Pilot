package com.mohan.stock_pilot.wallet.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentRequestDto(UUID userId, BigDecimal amount, String paymentId) {
}

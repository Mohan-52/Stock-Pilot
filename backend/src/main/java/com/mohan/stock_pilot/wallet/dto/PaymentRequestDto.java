package com.mohan.stock_pilot.wallet.dto;


import java.util.UUID;

public record PaymentRequestDto(UUID userId, long amount, String paymentId) {
}

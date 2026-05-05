package com.mohan.stock_pilot.orders.dto;

import java.time.Instant;
import java.util.UUID;

public record OrderHistoryDto(
        UUID orderId,
        String symbol,
        String type,
        long quantity,
        long priceInCents,
        String status,
        Instant createdAt
) {}

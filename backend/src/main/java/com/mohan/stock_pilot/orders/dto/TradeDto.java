package com.mohan.stock_pilot.orders.dto;

import java.time.Instant;
import java.util.UUID;

public record TradeDto(
        UUID tradeId,
        UUID orderId,
        String symbol,
        long quantity,
        long priceIncents,
        Instant executed
) {}

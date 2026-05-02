package com.mohan.stock_pilot.orders.dto;

import java.util.UUID;

public record SellOrderRequestDto(UUID userId, String symbol, long quantity) {
}

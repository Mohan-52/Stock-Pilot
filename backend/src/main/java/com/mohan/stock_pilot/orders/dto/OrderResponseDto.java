package com.mohan.stock_pilot.orders.dto;

import java.util.UUID;

public record OrderResponseDto(UUID orderId, String status) {
}

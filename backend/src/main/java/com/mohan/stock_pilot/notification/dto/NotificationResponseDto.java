package com.mohan.stock_pilot.notification.dto;

import java.util.List;

public record NotificationResponseDto(
        List<NotificationDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
}

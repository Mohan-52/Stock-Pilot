package com.mohan.stock_pilot.notification.dto;

import com.mohan.stock_pilot.notification.enums.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        String title,
        String message,
        NotificationType type,
        boolean isRead,
        Instant createdAt

) {
}

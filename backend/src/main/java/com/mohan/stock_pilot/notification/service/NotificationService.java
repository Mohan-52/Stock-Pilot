package com.mohan.stock_pilot.notification.service;

import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.notification.dto.NotificationDto;
import com.mohan.stock_pilot.notification.dto.NotificationResponseDto;
import com.mohan.stock_pilot.notification.entity.Notification;
import com.mohan.stock_pilot.notification.enums.NotificationType;
import com.mohan.stock_pilot.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public void createNotification(
            UUID userId,
            String title,
            String message,
            NotificationType type
    ) {

        Notification notification =
                Notification.builder()
                        .userId(userId)
                        .title(title)
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .build();

        Notification saved=notificationRepo.save(notification);

        NotificationDto dto=toDto(saved);

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                dto
        );
    }

    public NotificationResponseDto getNotifications(
            UUID userId,
            Pageable pageable
    ) {

        Page<Notification> notifications =
                notificationRepo.findByUserId(
                        userId,
                        pageable
                );

        return new NotificationResponseDto(
                notifications.getContent()
                        .stream()
                        .map(this::toDto)
                        .toList(),
                notifications.getNumber(),
                notifications.getSize(),
                notifications.getTotalElements(),
                notifications.getTotalPages(),
                notifications.isLast()
        );
    }

    public void markAsRead(
            UUID userId,
            UUID notificationId
    ) {

        Notification notification =
                notificationRepo.findById(notificationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundEx(
                                        "Notification not found"
                                ));

        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundEx(
                    "Notification not found"
            );
        }

        notification.setRead(true);
        notification.setReadAt(Instant.now());

        notificationRepo.save(notification);
    }

    public void markAllAsRead(
            UUID userId
    ) {

        List<Notification> notifications =
                notificationRepo.findByUserIdAndIsReadFalse(
                        userId
                );

        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(Instant.now());
        });

        notificationRepo.saveAll(notifications);
    }

    public long getUnreadCount(
            UUID userId
    ) {

        return notificationRepo
                .countByUserIdAndIsReadFalse(
                        userId
                );
    }

    private NotificationDto toDto(
            Notification notification
    ) {

        return new NotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
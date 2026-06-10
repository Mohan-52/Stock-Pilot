package com.mohan.stock_pilot.notification.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.notification.dto.NotificationResponseDto;
import com.mohan.stock_pilot.notification.dto.UnreadCountDto;
import com.mohan.stock_pilot.notification.service.NotificationService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<NotificationResponseDto> getNotifications(
            @AuthenticationPrincipal
            CustomUserDetails user,
            @PageableDefault(
                    page = 0,
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                notificationService.getNotifications(
                        user.getUserId(),
                        pageable
                )
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountDto> getUnreadCount(
            @AuthenticationPrincipal
            CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                new UnreadCountDto( notificationService.getUnreadCount(
                        user.getUserId()
                ))

        );
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse> markAsRead(
            @AuthenticationPrincipal
            CustomUserDetails user,
            @PathVariable UUID notificationId
    ) {

        notificationService.markAsRead(
                user.getUserId(),
                notificationId
        );

        return ResponseEntity.ok(
                new ApiResponse(
                        "Notification marked as read"
                )
        );
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(
            @AuthenticationPrincipal
            CustomUserDetails user
    ) {

        notificationService.markAllAsRead(
                user.getUserId()
        );

        return ResponseEntity.ok(
                new ApiResponse(
                        "All notifications marked as read"
                )
        );
    }
}
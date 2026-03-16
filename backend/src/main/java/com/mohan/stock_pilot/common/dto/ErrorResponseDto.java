package com.mohan.stock_pilot.common.dto;

import java.time.LocalDateTime;

public record ErrorResponseDto(LocalDateTime timeStamp, String error, String path, String message, int status) {
}

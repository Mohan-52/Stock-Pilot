package com.mohan.stock_pilot.auth.dto;

import org.springframework.web.multipart.MultipartFile;

public record UpdateProfileRequestDto(String fullName, MultipartFile profilePhoto) {
}

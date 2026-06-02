package com.mohan.stock_pilot.sip.dto;

import java.util.List;

public record SipResponseDto(
        List<SipDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
}

package com.mohan.stock_pilot.sip.dto;

import java.util.List;

public record SipExecutionHistoryResponse(
        List<SipExecutionDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}

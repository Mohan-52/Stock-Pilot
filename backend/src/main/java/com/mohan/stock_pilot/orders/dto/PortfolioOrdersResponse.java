package com.mohan.stock_pilot.orders.dto;

import java.util.List;

public record PortfolioOrdersResponse(
        List<OrderHistoryDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}

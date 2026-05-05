package com.mohan.stock_pilot.portfolio.dto;

import java.util.List;

public record PortfolioPositionsResponseDto(
        List<PortfolioPositionDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}

package com.mohan.stock_pilot.portfolio.dto;

import java.util.List;

public record PortfolioResponseDto(
        long totalInvested,
        long totalCurrentValue,
        long totalPnl,
        List<PortfolioPositionDto> positions

) {}

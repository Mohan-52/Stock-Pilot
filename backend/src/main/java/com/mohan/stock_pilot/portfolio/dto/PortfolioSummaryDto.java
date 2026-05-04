package com.mohan.stock_pilot.portfolio.dto;

public record PortfolioSummaryDto(
        long totalInvested,
        long totalCurrentValue,
        long totalPnl,
        double pnlPercentage
) {
}

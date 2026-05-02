package com.mohan.stock_pilot.portfolio.dto;

public record PortfolioPositionDto (String symbol, long quantity, long avgPriceInCents, long currentPriceInCents, long invested, long currentValue, long pnl, double pnlPercentage){
}

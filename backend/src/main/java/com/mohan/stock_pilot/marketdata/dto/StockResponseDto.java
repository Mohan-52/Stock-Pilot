package com.mohan.stock_pilot.marketdata.dto;

public record StockResponseDto(
        String id,
        String symbol,
        String name,
        String exchange,
        String currency,
        String industry,
        String logoUrl,
        String websiteUrl,
        double price,
        long timestamp,
        boolean watchlisted

) {}
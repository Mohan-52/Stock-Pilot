package com.mohan.stock_pilot.marketdata.dto;

import java.util.UUID;

public record InstrumentCacheDto(
        UUID id,
        String symbol,
        String name,
        String exchange,
        String currency,
        String industry,
        String logoUrl,
        String websiteUrl) {
}

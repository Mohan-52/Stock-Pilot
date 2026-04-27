package com.mohan.stock_pilot.marketdata.dto;

public record InstrumentCacheDto(String symbol, String name, String exchange, String currency, String industry, String logoUrl, String websiteUrl) {
}

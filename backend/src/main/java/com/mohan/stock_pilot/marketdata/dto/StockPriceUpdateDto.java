package com.mohan.stock_pilot.marketdata.dto;

public record StockPriceUpdateDto(String symbol, double price, long timestamp) {
}

package com.mohan.stock_pilot.marketdata.dto;

public record StockResponseDto(String symbol, double price, long timestamp) {
}

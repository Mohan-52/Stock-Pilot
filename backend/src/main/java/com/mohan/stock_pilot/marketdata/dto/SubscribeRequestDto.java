package com.mohan.stock_pilot.marketdata.dto;

public record SubscribeRequestDto(String type, String symbol) {
    public static SubscribeRequestDto subscribe(String symbol){
        return new SubscribeRequestDto("subscribe", symbol);
    }
}

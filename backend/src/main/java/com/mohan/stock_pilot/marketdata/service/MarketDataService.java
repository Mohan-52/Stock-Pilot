package com.mohan.stock_pilot.marketdata.service;

import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.net.http.WebSocket;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketDataService {
    private final PopularInstrumentService popularService;
    private final RedisTemplate<String, String> redisTemplate;

    private WebSocket webSocket;
    private List<String> symbols;

    @PostConstruct
    public void init(){
        this.symbols=popularService.getSymbolsByCategory(MarketCategory.TOP_50);
        connect();
    }

    private void connect() {
        // open websocket connection
        // on open → subscribe all symbols
        // on message → handleMessage
        // on failure → reconnect
    }

    private void subscribe(String symbol) {
        // send: { "type": "subscribe", "symbol": symbol }
    }

    private void handleMessage(String message) {
        // parse JSON
        // extract symbol + price
        // store in Redis
    }

    private void reconnect() {
        // retry logic
    }


}

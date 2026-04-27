package com.mohan.stock_pilot.marketdata.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.marketdata.dto.SubscribeRequestDto;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarketDataService {
    private final PopularInstrumentService popularService;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${finnhub.api-key}")
    private String API_KEY;
    

    private  WebSocket webSocket;
    private List<String> symbols;

    @PostConstruct
    public void init(){
        this.symbols=popularService.getSymbolsByCategory(MarketCategory.TOP_50);
        connect();
    }

    private void connect() {
        OkHttpClient client= new OkHttpClient();

        String url="wss://ws.finnhub.io?token="+API_KEY;

        Request request=new Request.Builder()
                .url(url)
                .build();


        webSocket=client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
                System.out.println("WebSocket connected");
                symbols.forEach(s->subscribe(s));
            }

            @Override
            public void onMessage(WebSocket webSocket, String text){
                System.out.println("RAW TEXT "+text);
                handleMessage(text);
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                reconnect();
            }
        });
    }

    private void subscribe(String symbol) {
        try {
            SubscribeRequestDto payload = SubscribeRequestDto.subscribe(symbol);
            String msg = objectMapper.writeValueAsString(payload);

            webSocket.send(msg);

        } catch (Exception e) {
            System.err.println("Failed to subscribe: " + symbol);
        }
    }

    private void handleMessage(String message) {
        try{


            JsonNode root=objectMapper.readTree(message);

            if(!"trade".equals(root.path("type").asText())){
                return;
            }


                if(root.has("data")){
                for (JsonNode node: root.get("data")){
                    String rawSymbol=node.get("s").asText();
                    double price=node.get("p").asDouble();
                    long timestamp=node.get("t").asLong();

                    String symbol=normalizeSymbol(rawSymbol);

                    Map<String, Object> stock=Map.of(
                            "symbol", symbol,
                            "price", price,
                            "timestamp", timestamp
                    );

                    String json=objectMapper.writeValueAsString(stock);

                    redisTemplate.opsForHash()
                            .put("popular:TOP_50", symbol, json);
                }

            }

        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private void reconnect() {
        try{
            Thread.sleep(5000);
            connect();
        }catch (InterruptedException e){
            Thread.currentThread().interrupt();
        }
    }

    private String normalizeSymbol(String rawSymbol){
        if(rawSymbol.contains(":")){
            return rawSymbol.split(":")[1];
        }

        return rawSymbol;
    }


}

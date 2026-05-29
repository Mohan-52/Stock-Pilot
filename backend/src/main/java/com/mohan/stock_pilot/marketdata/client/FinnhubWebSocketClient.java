package com.mohan.stock_pilot.marketdata.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
import com.mohan.stock_pilot.marketdata.dto.SubscribeRequestDto;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.publisher.StockWebSocketPublisher;
import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class FinnhubWebSocketClient {

    @Value("${finnhub.api-key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    private final RedisTemplate<String, Object>
            redisTemplate;


    private final StockWebSocketPublisher
            socketPublisher;

    private WebSocket webSocket;

    public void connect() {

        OkHttpClient client =
                new OkHttpClient();

        String url =
                "wss://ws.finnhub.io?token="
                        + apiKey;

        Request request =
                new Request.Builder()
                        .url(url)
                        .build();

        webSocket =
                client.newWebSocket(
                        request,
                        new WebSocketListener() {

                            @Override
                            public void onOpen(
                                    WebSocket webSocket,
                                    Response response
                            ) {
                                System.out.println(
                                        "Connected to Finnhub"
                                );
                            }

                            @Override
                            public void onMessage(
                                    WebSocket webSocket,
                                    String text
                            ) {
                                handleMessage(text);

                            }

                            @Override
                            public void onFailure(
                                    WebSocket webSocket,
                                    Throwable t,
                                    Response response
                            ) {


                                reconnect();

                            }
                        }
                );

    }

    public void subscribe(
            String symbol
    ) {

        try {

            SubscribeRequestDto dto =
                    SubscribeRequestDto
                            .subscribe(symbol);


            String json =
                    objectMapper
                            .writeValueAsString(dto);

            webSocket.send(json);



        } catch (Exception ex) {


        }

    }

    private void reconnect() {

        try {

            Thread.sleep(5000);

            connect();

        } catch (
                InterruptedException ex
        ) {

            Thread.currentThread()
                    .interrupt();

        }

    }

    public void handleMessage(
            String message
    ) {

        try {

            JsonNode root =
                    objectMapper.readTree(message);

            if (
                    !"trade".equals(
                            root.path("type")
                                    .asText()
                    )
            ) {

                return;

            }

            if (root.has("data")) {

                for (
                        JsonNode node :
                        root.get("data")
                ) {

                    String rawSymbol =
                            node.get("s")
                                    .asText();

                    double price =
                            node.get("p")
                                    .asDouble();

                    long timestamp =
                            node.get("t")
                                    .asLong();

                    String symbol =
                            normalizeSymbol(
                                    rawSymbol
                            );

                    Map<String, Object> stock =
                            Map.of(

                                    "symbol",
                                    symbol,

                                    "price",
                                    price,

                                    "timestamp",
                                    timestamp

                            );

                    String json =
                            objectMapper
                                    .writeValueAsString(
                                            stock
                                    );

                    redisTemplate
                            .opsForHash()
                            .put(
                                    "live:stocks",
                                    symbol,
                                    json
                            );

                    StockResponseDto dto =
                            buildStockDto(symbol);

                    socketPublisher
                            .publishStockUpdate(
                                    MarketCategory.TOP_50,
                                    dto
                            );

                }

            }

        } catch (Exception ex) {

            ex.printStackTrace();

        }

    }


    private String normalizeSymbol(
            String rawSymbol
    ) {

        if (
                rawSymbol.contains(":")
        ) {

            return rawSymbol
                    .split(":")[1];

        }

        return rawSymbol;

    }

    private StockResponseDto buildStockDto(
            String symbol
    ) throws Exception {

        Object liveObj =
                redisTemplate
                        .opsForHash()
                        .get(
                                "live:stocks",
                                symbol
                        );

        Object instObj =
                redisTemplate
                        .opsForHash()
                        .get(
                                "instrument:cache",
                                symbol
                        );

        if (
                liveObj == null ||
                        instObj == null
        ) {

            throw new RuntimeException(
                    "Stock cache missing: "
                            + symbol
            );

        }

        JsonNode live =
                objectMapper.readTree(
                        liveObj.toString()
                );

        JsonNode inst =
                objectMapper.readTree(
                        instObj.toString()
                );

        return new StockResponseDto(

                symbol,

                inst.path("name")
                        .asText(),

                inst.path("exchange")
                        .asText(),

                inst.path("currency")
                        .asText(),

                inst.path("industry")
                        .asText(),

                inst.path("logoUrl")
                        .asText(),

                inst.path("websiteUrl")
                        .asText(),

                live.path("price")
                        .asDouble(),

                live.path("timestamp")
                        .asLong()

        );

    }

}

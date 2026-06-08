package com.mohan.stock_pilot.marketdata.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.marketdata.client.FinnhubWebSocketClient;
import com.mohan.stock_pilot.marketdata.dto.InstrumentCacheDto;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class MarketDataService {

    private final PopularInstrumentService
            popularService;

    private final RedisTemplate<String, Object>
            redisTemplate;

    private final ObjectMapper
            objectMapper;



    private final FinnhubWebSocketClient
            finnhubWebSocketClient;

    private final Set<String>
            subscribedSymbols =
            ConcurrentHashMap.newKeySet();

    @PostConstruct
    public void init() {

        cacheInstruments();

        finnhubWebSocketClient.connect();

        subscribeCategory(
                MarketCategory.TOP_50
        );

    }

    public void subscribeCategory(
            MarketCategory category
    ) {

        List<Instrument> instruments =
                popularService
                        .getInstrumentsByCategory(
                                category
                        );

        instruments.forEach(inst -> {

            subscribeIfNeeded(
                    inst.getSymbol()
            );

        });

    }

    public void subscribeIfNeeded(
            String symbol
    ) {

        if (
                subscribedSymbols.add(symbol)
        ) {

            finnhubWebSocketClient
                    .subscribe(symbol);

        }

    }





    public void cacheInstruments() {

        List<Instrument> instruments =
                popularService
                        .geAllDistinctInstruments();

        for (
                Instrument inst :
                instruments
        ) {

            try {

                InstrumentCacheDto dto =
                        new InstrumentCacheDto(
                                inst.getId(),
                                inst.getSymbol(),

                                inst.getName(),

                                inst.getExchange(),

                                inst.getCurrency(),

                                Optional.ofNullable(
                                        inst.getIndustry()
                                ).orElse(""),

                                Optional.ofNullable(
                                        inst.getLogoUrl()
                                ).orElse(""),

                                Optional.ofNullable(
                                        inst.getWebsiteUrl()
                                ).orElse("")

                        );

                redisTemplate
                        .opsForHash()
                        .put(

                                "instrument:cache",

                                inst.getSymbol(),

                                objectMapper
                                        .writeValueAsString(
                                                dto
                                        )

                        );

            } catch (Exception ex) {

                System.out.println(
                        "Failed cache: "
                                + inst.getSymbol()
                );

            }

        }

    }

    public long getPriceInCents(
            String symbol
    ) {

        try {

            Object json =
                    redisTemplate
                            .opsForHash()
                            .get(
                                    "live:stocks",
                                    symbol
                            );

            if (json == null) {

                subscribeIfNeeded(symbol);

                throw new ResourceNotFoundEx(
                        "Price not available for symbol: "
                                + symbol
                );

            }

            JsonNode node =
                    objectMapper.readTree(
                            json.toString()
                    );

            double price =
                    node.get("price")
                            .asDouble();

            return Math.round(
                    price * 100
            );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to fetch price for: "
                            + symbol,
                    ex
            );

        }

    }

    public Map<String, Long> getPrices(
            Set<String> symbols
    ) {

        symbols.forEach(
                this::subscribeIfNeeded
        );

        List<String> symbolList =
                new ArrayList<>(symbols);

        List<Object> data =
                redisTemplate
                        .opsForHash()
                        .multiGet(
                                "live:stocks",
                                new ArrayList<>(
                                        symbolList
                                )
                        );

        Map<String, Long> result =
                new HashMap<>();

        for (
                int i = 0;
                i < symbolList.size();
                i++
        ) {

            String symbol =
                    symbolList.get(i);

            Object obj =
                    data.get(i);

            if (obj != null) {

                try {

                    JsonNode node =
                            objectMapper.readTree(
                                    obj.toString()
                            );

                    long price =
                            Math.round(

                                    node.get("price")
                                            .asDouble()

                                            * 100

                            );

                    result.put(
                            symbol,
                            price
                    );

                } catch (
                        JsonProcessingException e
                ) {

                    throw new RuntimeException(
                            "Error parsing price for "
                                    + symbol,
                            e
                    );

                }

            }

        }

        return result;

    }



}
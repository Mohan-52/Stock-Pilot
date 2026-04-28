package com.mohan.stock_pilot.marketdata.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.repository.PopularInstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PopularInstrumentService {
    private final PopularInstrumentRepository popInstrRepo;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public List<Instrument> getInstrumentsByCategory(MarketCategory category){
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }

        return popInstrRepo.findInstrumentsByCategory(category);
    }

    public List<StockResponseDto> getStocks(MarketCategory category) {

        Map<Object, Object> liveData =
                redisTemplate.opsForHash().entries("popular:" + category);

        return liveData.entrySet().stream()
                .map(entry -> {

                    String symbol = entry.getKey().toString();

                    try {
                        JsonNode live = objectMapper.readTree(entry.getValue().toString());

                        double price = live.path("price").asDouble();
                        long timestamp = live.path("timestamp").asLong();

                        Object value = redisTemplate.opsForValue()
                                .get("instrument:" + symbol);
                        String instJson= value!=null?value.toString():null;

                        JsonNode inst = objectMapper.readTree(instJson);

                        return new StockResponseDto(
                                symbol,
                                inst.path("name").asText(""),
                                inst.path("exchange").asText(""),
                                inst.path("currency").asText(""),
                                inst.path("industry").asText(""),
                                inst.path("logoUrl").asText(""),
                                inst.path("websiteUrl").asText(""),
                                price,
                                timestamp
                        );

                    } catch (Exception e) {
                        throw new RuntimeException("Error parsing stock data", e);
                    }

                })
                .toList();
    }
}

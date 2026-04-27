package com.mohan.stock_pilot.marketdata.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
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
    public List<String> getSymbolsByCategory(MarketCategory category){
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }

        return popInstrRepo.findSymbolsByCategory(category);
    }

    public List<StockResponseDto> getStocks(MarketCategory category){
        Map<Object, Object> data=redisTemplate.opsForHash().entries("popular:"+category);

        return data.values().stream()
                .map(val-> {
                    try {
                        return objectMapper.readValue(val.toString(), StockResponseDto.class);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }
}

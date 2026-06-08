package com.mohan.stock_pilot.marketdata.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.repository.PopularInstrumentRepository;
import com.mohan.stock_pilot.watchlist.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PopularInstrumentService {
    private final PopularInstrumentRepository popInstrRepo;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final WatchlistRepository watchlistRepo;

    public List<Instrument> getInstrumentsByCategory(MarketCategory category){
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }

        return popInstrRepo.findInstrumentsByCategory(category);
    }

    public List<StockResponseDto> getStocks(
            MarketCategory category,
            UUID userId
    ) {

        List<Instrument> instruments =
                popInstrRepo
                        .findInstrumentsByCategory(
                                category
                        );

        List<String> watchlistSymbols =watchlistRepo.findSymbolsByUserId(userId);
        Set<String> watchlistSet=new HashSet<>(watchlistSymbols);

        List<String> symbols =
                instruments.stream()
                        .map(Instrument::getSymbol)
                        .toList();


        List<Object> livePrices =
                redisTemplate
                        .opsForHash()
                        .multiGet(
                                "live:stocks",
                                new ArrayList<>(symbols)
                        );

        List<Object> metadata =
                redisTemplate
                        .opsForHash()
                        .multiGet(
                                "instrument:cache",
                                new ArrayList<>(symbols)
                        );

        List<StockResponseDto> result =
                new ArrayList<>();

        for(
                int i=0;
                i<symbols.size();
                i++
        ){

            try{

                JsonNode live =
                        objectMapper.readTree(
                                livePrices.get(i)
                                        .toString()
                        );

                JsonNode inst =
                        objectMapper.readTree(
                                metadata.get(i)
                                        .toString()
                        );



                result.add(

                        new StockResponseDto(

                                inst.path("id")
                                                .asText(),

                                symbols.get(i),

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
                                        .asLong(),
                                watchlistSet.contains(symbols.get(i))

                        )

                );

            }catch(Exception ex){

                throw new RuntimeException(
                        ex
                );

            }

        }

        return result;

    }
    public List<Instrument> geAllDistinctInstruments(){
        return popInstrRepo.findDistinctPopularInstruments();
    }
}

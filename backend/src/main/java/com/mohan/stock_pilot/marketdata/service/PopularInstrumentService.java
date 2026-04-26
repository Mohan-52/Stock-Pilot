package com.mohan.stock_pilot.marketdata.service;

import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.repository.PopularInstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PopularInstrumentService {
    private final PopularInstrumentRepository popInstrRepo;

    public List<String> getSymbolsByCategory(MarketCategory category){
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }

        return popInstrRepo.findSymbolsByCategory(category);
    }
}

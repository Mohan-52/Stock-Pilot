package com.mohan.stock_pilot.marketdata.controller;

import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.service.PopularInstrumentService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class PopularInstrumentController {

    private final PopularInstrumentService instrumentService;

    @GetMapping
    public ResponseEntity<List<StockResponseDto>> getPopularStocks(
            @RequestParam(value = "category", defaultValue = "TOP_50") MarketCategory category) {

        return ResponseEntity.ok(instrumentService.getStocks(category));
    }
}

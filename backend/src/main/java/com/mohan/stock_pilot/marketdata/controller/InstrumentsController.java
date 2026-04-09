package com.mohan.stock_pilot.marketdata.controller;

import com.mohan.stock_pilot.marketdata.service.InstrumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instruments")
@RequiredArgsConstructor
public class InstrumentsController {

    private final InstrumentService instrumentService;

    @PostMapping("/sync")
    public String syncInstruments(@RequestParam(defaultValue = "US") String exchange) {
        int count = instrumentService.syncInstruments(exchange);
        return count + " instruments synced successfully";
    }
}

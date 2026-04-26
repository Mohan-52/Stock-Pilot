package com.mohan.stock_pilot.marketdata.controller;

import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import com.mohan.stock_pilot.marketdata.repository.PopularInstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.mapping.List;
import org.hibernate.mapping.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/popular")
@RequiredArgsConstructor
public class PopularInstrumentController {

    private final PopularInstrumentRepository popInstrRepo;

   // public Map<String, String> getTop50(){
       // return popInstrRepo.findSymbolsByCategory(MarketCategory.TOP_50);
  //  }
}

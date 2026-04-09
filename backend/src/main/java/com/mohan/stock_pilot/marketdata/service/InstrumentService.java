package com.mohan.stock_pilot.marketdata.service;

import com.mohan.stock_pilot.marketdata.client.FinnhubClient;
import com.mohan.stock_pilot.marketdata.dto.FinnhubSymbolResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class InstrumentService {
    private final FinnhubClient finnhubClient;
    private final InstrumentBatchService instrumentBatchService;

    private static final int BATCH_SIZE= 500;

   public int syncInstruments(String exchange){
       List<FinnhubSymbolResponseDto> symbols=finnhubClient.getAllSymbols(exchange);

       int totalSaved=0;

       for (int i=0; i<symbols.size();i+=BATCH_SIZE){
           int end=Math.min(i+BATCH_SIZE, symbols.size());
           List<FinnhubSymbolResponseDto> batch = symbols.subList(i, end);

           totalSaved += instrumentBatchService.saveBatch(batch);

       }

       return totalSaved;
   }
}

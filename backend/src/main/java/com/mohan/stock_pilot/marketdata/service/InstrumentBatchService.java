package com.mohan.stock_pilot.marketdata.service;

import com.mohan.stock_pilot.marketdata.dto.FinnhubSymbolResponseDto;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstrumentBatchService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public int saveBatch(List<FinnhubSymbolResponseDto> batch){
        int saved=0;

        for(FinnhubSymbolResponseDto dto: batch){

            try{
                Instrument instrument=mapToEntity(dto);
                entityManager.persist(instrument);
                saved++;
            }catch (Exception e){
                System.err.println("Failed to save symbol: "+dto.getSymbol());
            }

        }

        entityManager.flush();
        entityManager.clear();

        return saved;
    }

    private Instrument mapToEntity(FinnhubSymbolResponseDto dto) {
        return Instrument.builder()
                .symbol(dto.getSymbol())
                .displaySymbol(dto.getDisplaySymbol())
                .name(dto.getDescription())
                .exchange("US")
                .description(dto.getDescription())
                .currency(dto.getCurrency())
                .type(dto.getType())
                .mic(dto.getMic())
                .isin(dto.getIsin())
                .figi(dto.getFigi())
                .build();
    }

}

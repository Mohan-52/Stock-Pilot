package com.mohan.stock_pilot.marketdata.service;

import com.mohan.stock_pilot.marketdata.client.FinnhubClient;
import com.mohan.stock_pilot.marketdata.dto.CompanyProfileDTO;
import com.mohan.stock_pilot.marketdata.dto.FinnhubSymbolResponseDto;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.repository.InstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class InstrumentService {
    private final FinnhubClient finnhubClient;
    private final InstrumentBatchService instrumentBatchService;
    private final InstrumentRepository repo;

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

   public void enrichNext(){
       Optional<Instrument> opt= repo.findTopByProfileEnrichedFalseAndActiveTrue();

       if(opt.isEmpty()) return;

       Instrument instrument=opt.get();

       try{
           CompanyProfileDTO dto=finnhubClient.fetchProfile(instrument.getSymbol());
           mapAndSave(instrument, dto);

       }catch (Exception ex){
           ex.printStackTrace(); // or log.error(...)

       }
   }

   public void mapAndSave(Instrument instrument, CompanyProfileDTO dto){
       if (dto == null || dto.getName() == null) {
           instrument.setProfileEnriched(true);
           instrument.setProfileLastUpdatedAt(LocalDateTime.now());
           repo.save(instrument);
           return;
       }
       instrument.setName(dto.getName());
       instrument.setCountry(dto.getCountry());
       instrument.setCurrency(dto.getCurrency());
       instrument.setExchange(dto.getExchange());

       instrument.setIndustry(dto.getFinnhubIndustry());
       instrument.setWebsiteUrl(dto.getWeburl());
       instrument.setLogoUrl(dto.getLogo());

       if (dto.getIpo() != null && !dto.getIpo().isBlank()) {
           instrument.setIpoDate(LocalDate.parse(dto.getIpo()));
       }

       instrument.setProfileEnriched(true);
       instrument.setProfileLastUpdatedAt(LocalDateTime.now());

       repo.save(instrument);



   }
}

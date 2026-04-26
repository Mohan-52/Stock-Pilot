package com.mohan.stock_pilot.marketdata.scheduler;

import com.mohan.stock_pilot.marketdata.service.InstrumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ProfileEnrichmentScheduler {

    private final InstrumentService instrumentService;

    // @Scheduled(fixedDelay = 1000)
    public void enrichProfiles(){
        instrumentService.enrichNext();
    }
}

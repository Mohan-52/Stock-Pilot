package com.mohan.stock_pilot.sip.scheduler;

import com.mohan.stock_pilot.sip.entity.Sip;
import com.mohan.stock_pilot.sip.enums.SipStatus;
import com.mohan.stock_pilot.sip.repository.SipRepository;
import com.mohan.stock_pilot.sip.service.SipExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SipScheduler {
    private final SipRepository sipRepository;
    private final SipExecutionService sipExecutionService;

    @Scheduled(fixedDelayString = "${sip.scheduler.delay-ms:6000}")
    public void processDueSips(){
        List<Sip> dueSips=
                sipRepository.findByStatusAndNextExecutionDateLessThanEqual(SipStatus.ACTIVE, Instant.now());

        for (Sip sip : dueSips) {
            try {
                sipExecutionService.executeSip(sip.getId());
            } catch (Exception ex) {
                log.error(
                        "SIP scheduler failed for SIP {}",
                        sip.getId(),
                        ex
                );
            }
        }
    }
}

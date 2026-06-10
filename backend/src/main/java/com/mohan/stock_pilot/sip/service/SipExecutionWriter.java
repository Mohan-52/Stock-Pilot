package com.mohan.stock_pilot.sip.service;

import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.notification.enums.NotificationType;
import com.mohan.stock_pilot.notification.service.NotificationService;
import com.mohan.stock_pilot.sip.entity.Sip;
import com.mohan.stock_pilot.sip.entity.SipExecution;
import com.mohan.stock_pilot.sip.enums.SipExecutionStatus;
import com.mohan.stock_pilot.sip.enums.SipFrequency;
import com.mohan.stock_pilot.sip.repository.SipExecutionRepository;
import com.mohan.stock_pilot.sip.repository.SipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SipExecutionWriter {

    private final SipRepository sipRepo;
    private final SipExecutionRepository sipExecutionRepo;
    private final NotificationService notificationService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordSuccessAndAdvance(
            UUID userId,
            String instrumentName,
            UUID sipId,
            long stockPrice,
            long quantity,
            long investedAmount
    ) {
        Sip sip = getSip(sipId);

        sipExecutionRepo.save(
                SipExecution.builder()
                        .sipId(sipId)
                        .executionTime(Instant.now())
                        .stockPrice(stockPrice)
                        .quantity(quantity)
                        .investedAmount(investedAmount)
                        .status(SipExecutionStatus.SUCCESS)
                        .build()
        );

        moveToNextCycle(sip);
        notificationService.createNotification(
                userId,
                "SIP Executed",
                    "Successfully invested $"+ investedAmount/100.0+ "in "+instrumentName,
                NotificationType.SIP_SUCCESS
        );
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailureAndAdvance(
            UUID userId,
            String instrumentName,
            UUID sipId,
            long stockPrice,
            String reason
    ) {
        Sip sip = getSip(sipId);

        sipExecutionRepo.save(
                SipExecution.builder()
                        .sipId(sipId)
                        .executionTime(Instant.now())
                        .stockPrice(stockPrice)
                        .quantity(0)
                        .investedAmount(0)
                        .status(SipExecutionStatus.FAILED)
                        .failureReason(reason)
                        .build()
        );

        moveToNextCycle(sip);

        notificationService.createNotification(
                userId,
                "SIP Failed",
                reason,
                NotificationType.SIP_FAILED
        );
    }

    private Sip getSip(UUID sipId) {
        return sipRepo.findById(sipId)
                .orElseThrow(() ->
                        new ResourceNotFoundEx(
                                "Sip not found with id " + sipId
                        ));
    }

    private void moveToNextCycle(Sip sip) {
        sip.setNextExecutionDate(
                calculateNextExecutionDate(
                        sip.getNextExecutionDate(),
                        sip.getFrequency()
                )
        );
    }

    private Instant calculateNextExecutionDate(
            Instant currentExecutionDate,
            SipFrequency frequency
    ) {
        return switch (frequency) {
            case MINUTELY ->
                    currentExecutionDate.plus(
                            1,
                            ChronoUnit.MINUTES
                    );

            case DAILY ->
                    currentExecutionDate.plus(
                            1,
                            ChronoUnit.DAYS
                    );

            case WEEKLY ->
                    currentExecutionDate.plus(
                            7,
                            ChronoUnit.DAYS
                    );

            case MONTHLY ->
                    currentExecutionDate
                            .atZone(ZoneOffset.UTC)
                            .plusMonths(1)
                            .toInstant();
        };
    }
}

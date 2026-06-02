package com.mohan.stock_pilot.sip.service;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.repository.InstrumentRepository;
import com.mohan.stock_pilot.sip.dto.CreateSipRequestDto;
import com.mohan.stock_pilot.sip.dto.SipDto;
import com.mohan.stock_pilot.sip.dto.SipResponseDto;
import com.mohan.stock_pilot.sip.dto.UpdateSipRequestDto;
import com.mohan.stock_pilot.sip.entity.Sip;
import com.mohan.stock_pilot.sip.enums.SipFrequency;
import com.mohan.stock_pilot.sip.enums.SipStatus;
import com.mohan.stock_pilot.sip.repository.SipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SipService {
    private final SipRepository sipRepo;
    private final InstrumentRepository instrumentRepo;

    public ApiResponse createSip(UUID userId, CreateSipRequestDto request){

        if(!instrumentRepo.existsById(request.instrumentId())){
            throw new ResourceNotFoundEx("Instrument doesn't exists");
        }

        if (request.amountPerCycle() <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero"
            );
        }


        if(sipRepo.existsByUserIdAndInstrumentId(userId,request.instrumentId())){
            throw new ResourceAlreadyExistsEx("SIP already exists for this instrument");
        };

        Sip sip=Sip.builder()
                .userId(userId)
                .amountPerCycle(request.amountPerCycle()*100)
                .frequency(request.frequency())
                .startDate(LocalDate.now())
                .instrumentId(request.instrumentId())
                .nextExecutionDate(calculateNextExecutionDate(Instant.now(), request.frequency()))
                .status(SipStatus.ACTIVE)
                .build();

        sipRepo.save(sip);


        return new ApiResponse("Sip has Successfully started");

    }

    public SipResponseDto getUserSips(
            Pageable pageable,
            UUID userId
    ) {

        Page<SipDto> page =
                sipRepo.findSipDtosByUserId(userId, pageable);

        return new SipResponseDto(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    private SipDto toSipDto(Sip sip) {

        Instrument instrument = instrumentRepo
                .findById(sip.getInstrumentId())
                .orElseThrow(() -> new ResourceNotFoundEx(
                        "Instrument not found"));

        return new SipDto(
                sip.getId(),
                sip.getInstrumentId(),
                instrument.getSymbol(),
                instrument.getCompanyName(),
                sip.getAmountPerCycle(),
                sip.getFrequency(),
                sip.getNextExecutionDate(),
                sip.getStatus()
        );
    }



    private Sip getUserSip(UUID userId, UUID sipId) {

        Sip sip = sipRepo.findById(sipId)
                .orElseThrow(() ->
                        new ResourceNotFoundEx("SIP not found"));

        if (!sip.getUserId().equals(userId)) {
            throw new ResourceNotFoundEx("SIP not found");
        }

        return sip;
    }

    public ApiResponse cancelSip(UUID userId, UUID sipId) {

        Sip sip = getUserSip(userId, sipId);

        if (sip.getStatus() == SipStatus.CANCELLED) {
            throw new IllegalStateException(
                    "SIP already cancelled"
            );
        }

        sip.setStatus(SipStatus.CANCELLED);

        sipRepo.save(sip);

        return new ApiResponse("SIP cancelled successfully");
    }

    public ApiResponse resumeSip(UUID userId, UUID sipId) {

        Sip sip = getUserSip(userId, sipId);

        if (sip.getStatus() != SipStatus.PAUSED) {
            throw new IllegalStateException(
                    "Only paused SIPs can be resumed"
            );
        }

        sip.setStatus(SipStatus.ACTIVE);

        sipRepo.save(sip);

        return new ApiResponse("SIP resumed successfully");
    }

    public ApiResponse pauseSip(UUID userId, UUID sipId) {

        Sip sip = getUserSip(userId, sipId);

        if (sip.getStatus() != SipStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Only active SIPs can be paused"
            );
        }

        sip.setStatus(SipStatus.PAUSED);

        sipRepo.save(sip);

        return new ApiResponse("SIP paused successfully");
    }

    public ApiResponse updateSip(
            UUID userId,
            UUID sipId,
            UpdateSipRequestDto request
    ) {

        Sip sip = getUserSip(userId, sipId);

        if (sip.getStatus() == SipStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cancelled SIP cannot be updated"
            );
        }

        if (request.amountPerCycle() <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero"
            );
        }

        sip.setAmountPerCycle(
                request.amountPerCycle() * 100
        );

        sip.setFrequency(
                request.frequency()
        );

        sip.setNextExecutionDate(
                calculateNextExecutionDate(
                        Instant.now(),
                        request.frequency()
                )
        );

        sipRepo.save(sip);

        return new ApiResponse(
                "SIP updated successfully"
        );
    }

    private Instant calculateNextExecutionDate(Instant currentExecutionDate, SipFrequency frequency) {
        return switch (frequency) {
            case DAILY -> currentExecutionDate.plus(1, ChronoUnit.DAYS);

            case WEEKLY -> currentExecutionDate.plus(7, ChronoUnit.DAYS);

            case MONTHLY -> currentExecutionDate
                    .atZone(ZoneOffset.UTC)
                    .plusMonths(1)
                    .toInstant();

        };

    }
}

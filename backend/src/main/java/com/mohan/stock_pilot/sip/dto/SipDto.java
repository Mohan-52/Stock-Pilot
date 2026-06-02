package com.mohan.stock_pilot.sip.dto;

import com.mohan.stock_pilot.sip.enums.SipFrequency;
import com.mohan.stock_pilot.sip.enums.SipStatus;

import java.time.Instant;
import java.util.UUID;

public record SipDto(
        UUID sipId,
        UUID instrumentId,
        String symbol,
        String companyName,
        long amountPerCycle,
        SipFrequency frequency,
        Instant nextExecutionDate,
        SipStatus status
) {}

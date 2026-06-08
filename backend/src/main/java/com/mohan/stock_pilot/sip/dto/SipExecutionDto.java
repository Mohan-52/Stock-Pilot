package com.mohan.stock_pilot.sip.dto;

import com.mohan.stock_pilot.sip.enums.SipExecutionStatus;

import java.time.Instant;

public record SipExecutionDto(
        Instant executionTime,
        long stockPrice,
        long quantity,
        long investedAmount,
        SipExecutionStatus status,
        String failureReason
) {}

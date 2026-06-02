package com.mohan.stock_pilot.sip.dto;

import com.mohan.stock_pilot.sip.enums.SipFrequency;

import java.util.UUID;

public record CreateSipRequestDto(UUID instrumentId, long amountPerCycle, SipFrequency frequency) {
}

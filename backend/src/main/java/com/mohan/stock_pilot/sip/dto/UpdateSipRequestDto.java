package com.mohan.stock_pilot.sip.dto;

import com.mohan.stock_pilot.sip.enums.SipFrequency;

public record UpdateSipRequestDto(
        long amountPerCycle,
        SipFrequency frequency
) {
}

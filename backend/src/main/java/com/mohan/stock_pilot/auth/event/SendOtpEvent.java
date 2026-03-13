package com.mohan.stock_pilot.auth.event;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SendOtpEvent {

    private final String email;
    private final String otp;

}
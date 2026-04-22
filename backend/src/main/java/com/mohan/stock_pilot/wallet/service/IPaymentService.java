package com.mohan.stock_pilot.wallet.service;

import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;

public interface IPaymentService {
    String createPaymentIntent(CreatePaymentRequestDto requestDto);
}

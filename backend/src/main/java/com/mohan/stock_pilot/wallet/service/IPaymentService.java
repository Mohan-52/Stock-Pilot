package com.mohan.stock_pilot.wallet.service;

import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;
import com.stripe.model.PaymentIntent;
import jakarta.servlet.http.HttpServletRequest;

import java.util.UUID;

public interface IPaymentService {
    String createPaymentIntent(UUID userId, CreatePaymentRequestDto requestDto);
    void handleWebhook(HttpServletRequest request) throws Exception;
}

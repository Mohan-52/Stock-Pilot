package com.mohan.stock_pilot.wallet.controller;

import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;
import com.mohan.stock_pilot.wallet.service.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @PostMapping("/create-intent")
    public String createPaymentIntent(
            @RequestBody CreatePaymentRequestDto request) {
        return paymentService.createPaymentIntent(request);
    }
}
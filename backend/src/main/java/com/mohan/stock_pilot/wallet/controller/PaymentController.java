package com.mohan.stock_pilot.wallet.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;
import com.mohan.stock_pilot.wallet.dto.CreatePaymentResponseDto;
import com.mohan.stock_pilot.wallet.service.IPaymentService;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;



    @PostMapping("/create-intent")
    public ResponseEntity<CreatePaymentResponseDto> createPaymentIntent(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                        @RequestBody CreatePaymentRequestDto request) {
        UUID userId=userDetails.getUser().getId();
        String clientSecret= paymentService.createPaymentIntent(userId,request);
        CreatePaymentResponseDto responseDto=new CreatePaymentResponseDto(clientSecret);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse> handleWebhook(
            HttpServletRequest request
    ) throws Exception {

        paymentService.handleWebhook(request);

        ApiResponse response =
                new ApiResponse("Webhook processed");

        return ResponseEntity.ok(response);
    }


}


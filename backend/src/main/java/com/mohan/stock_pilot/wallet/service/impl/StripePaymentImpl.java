package com.mohan.stock_pilot.wallet.service.impl;

import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;
import com.mohan.stock_pilot.wallet.service.IPaymentService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripePaymentImpl implements IPaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Override
    public String createPaymentIntent(CreatePaymentRequestDto requestDto) {
        Stripe.apiKey = stripeSecretKey;

        try{
            PaymentIntentCreateParams params=
                    PaymentIntentCreateParams.builder()
                            .setAmount(requestDto.amount()*100)
                            .setCurrency("usd")
                            .putMetadata("userId",requestDto.userId().toString())
                            .build();

            PaymentIntent intent=PaymentIntent.create(params);

            return intent.getClientSecret();
        }catch (Exception e){
            throw new RuntimeException("Failed to create payment intent", e);
        }


    }
}

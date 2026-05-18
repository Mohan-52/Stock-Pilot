package com.mohan.stock_pilot.wallet.service.impl;

import com.mohan.stock_pilot.wallet.dto.CreatePaymentRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import com.mohan.stock_pilot.wallet.enums.TransactionStatus;
import com.mohan.stock_pilot.wallet.enums.TransactionType;
import com.mohan.stock_pilot.wallet.repository.WalletRepository;
import com.mohan.stock_pilot.wallet.repository.WalletTransactionRepository;
import com.mohan.stock_pilot.wallet.service.IPaymentService;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StripePaymentImpl implements IPaymentService {

    private final WalletTransactionRepository txnRepo;
    private final WalletRepository walletRepo;
    private final WalletServiceImpl walletService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;


    @Override
    @Transactional
    public String createPaymentIntent(
            UUID userId,
            CreatePaymentRequestDto requestDto
    ) {

        try {

            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(requestDto.amount() * 100)
                            .setCurrency("usd")
                            .putMetadata(
                                    "userId",
                                    userId.toString()
                            )
                            .build();

            PaymentIntent intent =
                    PaymentIntent.create(params);

            Wallet wallet = walletService.getWallet(userId);

            WalletTransaction txn =
                    WalletTransaction.builder()
                            .walletId(wallet.getId())
                            .amount(requestDto.amount() * 100)
                            .type(TransactionType.DEPOSIT)
                            .status(TransactionStatus.PENDING)
                            .referenceId(intent.getId())
                            .build();

            txnRepo.save(txn);

            System.out.println(
                    "Saved txn referenceId: "
                            + intent.getId()
            );

            return intent.getClientSecret();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "Failed to create payment intent",
                    e
            );
        }
    }

    @Transactional
    public void handleFailedPayment(
            PaymentIntent paymentIntent
    ) {

        WalletTransaction txn =
                txnRepo.findByReferenceId(
                        paymentIntent.getId()
                ).orElseThrow();

        txn.setStatus(TransactionStatus.FAILED);

        txnRepo.save(txn);
    }

    @Transactional
    public void handleSuccessfulPayment(
            PaymentIntent paymentIntent
    ) {



        WalletTransaction txn =
                txnRepo.findByReferenceId(
                        paymentIntent.getId()
                ).orElseThrow();

        if (txn.getStatus() ==
                TransactionStatus.SUCCESS) {
            return;
        }

        txn.setStatus(
                TransactionStatus.SUCCESS
        );

        txnRepo.save(txn);

        Wallet wallet =
                walletRepo.findById(
                        txn.getWalletId()
                ).orElseThrow();

        wallet.setBalance(
                wallet.getBalance()
                        + txn.getAmount()
        );

        walletRepo.save(wallet);
    }

    @Override
    @Transactional
    public void handleWebhook(
            HttpServletRequest request
    ) throws Exception {

        String payload =
                new String(
                        request.getInputStream()
                                .readAllBytes()
                );

        String signature =
                request.getHeader("Stripe-Signature");

        Event event;

        try {

            event = Webhook.constructEvent(
                    payload,
                    signature,
                    webhookSecret
            );


        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid Stripe webhook signature"
            );
        }



        switch (event.getType()) {
            case "payment_intent.succeeded":



                PaymentIntent paymentIntent =
                        (PaymentIntent)
                                event.getDataObjectDeserializer()
                                        .deserializeUnsafe();


                if (paymentIntent != null) {

                    handleSuccessfulPayment(
                            paymentIntent
                    );
                }

                break;

            case "payment_intent.payment_failed":

                PaymentIntent failedIntent =
                        (PaymentIntent)
                                event.getDataObjectDeserializer()
                                        .getObject()
                                        .orElse(null);

                if (failedIntent != null) {

                    handleFailedPayment(
                            failedIntent
                    );
                }

                break;

            default:
                break;
        }
    }
}

package com.mohan.stock_pilot.wallet.service;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.dto.PaymentRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface IWalletService {
    ApiResponse createWallet(UUID userId);
    Wallet getWallet(UUID userId);
    void processPayment(PaymentRequestDto requestDto);
    void debitWallet(DebitRequestDto requestDto);
    void creditWallet(UUID userId, long amount);
}

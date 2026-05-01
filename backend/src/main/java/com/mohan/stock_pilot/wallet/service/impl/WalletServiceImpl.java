package com.mohan.stock_pilot.wallet.service.impl;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.common.exception.InsufficientBalanceEx;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.dto.PaymentRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import com.mohan.stock_pilot.wallet.enums.TransactionStatus;
import com.mohan.stock_pilot.wallet.enums.TransactionType;
import com.mohan.stock_pilot.wallet.repository.WalletRepository;
import com.mohan.stock_pilot.wallet.repository.WalletTransactionRepository;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements IWalletService {

    private final WalletRepository walletRepo;
    private final WalletTransactionRepository txnRepo;

    @Override
    public ApiResponse createWallet(UUID userId) {

        if(walletRepo.existsByUserId(userId)) throw new ResourceAlreadyExistsEx("User has already have wallet");

        Wallet wallet= Wallet.builder()
                .userId(userId)
                .currency("USD")
                .balance(0)
                .build();

        walletRepo.save(wallet);

        return new ApiResponse("Wallet is successfully created for user");

    }

    @Override
    public Wallet getWallet(UUID userId) {
        return walletRepo.findByUserId(userId)
                .orElseThrow(()-> new ResourceNotFoundEx("Wallet not found for user"));
    }

    @Override
    @Transactional
    public void processPayment(PaymentRequestDto requestDto) {
        if(txnRepo.existsByReferenceId(requestDto.paymentId())){
            return;
        }

        Wallet wallet=getWallet(requestDto.userId());

        WalletTransaction txn = WalletTransaction.builder()
                .walletId(wallet.getId())
                .amount(requestDto.amount()*100)
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .referenceId(requestDto.paymentId())
                .build();

        txnRepo.save(txn);


        wallet.setBalance(wallet.getBalance()+requestDto.amount());

        walletRepo.save(wallet);
    }

    @Override
    @Transactional
    public void debitWallet(DebitRequestDto requestDto) {

        Wallet wallet = walletRepo.findByUserIdForUpdate(requestDto.userId())
                .orElseThrow(() -> new ResourceNotFoundEx("Wallet not found"));

        long amount = requestDto.amount();

        if (wallet.getBalance() < amount) {
            throw new InsufficientBalanceEx("Insufficient balance");
        }

        WalletTransaction txn = WalletTransaction.builder()
                .walletId(wallet.getId())
                .amount(amount)
                .type(TransactionType.BUY)
                .status(TransactionStatus.SUCCESS)
                .referenceId(UUID.randomUUID().toString())
                .build();

        txnRepo.save(txn);

        wallet.setBalance(wallet.getBalance() - amount);

        walletRepo.save(wallet);

    }


}

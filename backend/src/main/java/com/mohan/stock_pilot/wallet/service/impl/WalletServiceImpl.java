package com.mohan.stock_pilot.wallet.service.impl;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.common.exception.InsufficientBalanceEx;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.dto.PaymentRequestDto;
import com.mohan.stock_pilot.wallet.dto.WalletTxnDto;
import com.mohan.stock_pilot.wallet.dto.WalletTxnResponseDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import com.mohan.stock_pilot.wallet.enums.TransactionStatus;
import com.mohan.stock_pilot.wallet.enums.TransactionType;
import com.mohan.stock_pilot.wallet.repository.WalletRepository;
import com.mohan.stock_pilot.wallet.repository.WalletTransactionRepository;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
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

    @Override
    @Transactional
    public void creditWallet(UUID userId, long amount) {
        Wallet wallet=walletRepo.findByUserIdForUpdate(userId)
                .orElseThrow(()-> new ResourceNotFoundEx("Wallet Not found"));

        WalletTransaction walletTransaction=WalletTransaction.builder()
                .walletId(wallet.getId())
                .amount(amount)
                .type(TransactionType.SELL)
                .status(TransactionStatus.SUCCESS)
                .referenceId(UUID.randomUUID().toString())
                .build();

        txnRepo.save(walletTransaction);

        wallet.setBalance(wallet.getBalance()+amount);
    }

    public WalletTxnDto mapToWalletTxnDto(WalletTransaction txn){
        WalletTxnDto response=new WalletTxnDto(txn.getId(), txn.getType(), txn.getAmount(), txn.getReferenceId(), txn.getCreatedAt());
        return response;
    }

    @Override
    public WalletTxnResponseDto getWalletTransaction(UUID userId, Pageable pageable){
        Wallet wallet=getWallet(userId);
       Page<WalletTransaction> page=txnRepo.findAllByWalletId(wallet.getId(),pageable);

        List<WalletTxnDto> content=page.getContent().stream().map(this::mapToWalletTxnDto).toList();
       WalletTxnResponseDto responseDto=new WalletTxnResponseDto(content,
               page.getNumber(),
               page.getSize(),
               page.getTotalElements(),
               page.getTotalPages(),
               page.isLast());
       return responseDto;
    }


}

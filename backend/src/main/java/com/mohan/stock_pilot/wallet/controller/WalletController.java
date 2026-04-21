package com.mohan.stock_pilot.wallet.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.dto.PaymentRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {

    private final IWalletService walletService;

    @PostMapping
    public ApiResponse createWallet(@RequestParam("userId") UUID userId){
        return walletService.createWallet(userId);
    }

    @GetMapping
    public ResponseEntity<Wallet> getWallet(@RequestParam("userId") UUID userId){
        return ResponseEntity.status(HttpStatus.OK).body(walletService.getWallet(userId));
    }

    @PostMapping("/process/payment")
    public ResponseEntity<ApiResponse> processPayment(@RequestBody PaymentRequestDto requestDto){
        walletService.processPayment(requestDto);
        return ResponseEntity.ok(new  ApiResponse("Payment Successful"));
    }

    @PostMapping("/debit")
    public ResponseEntity<ApiResponse> debit(@RequestBody DebitRequestDto requestDto){
        walletService.debitWallet(requestDto);
        return ResponseEntity.ok(new ApiResponse("Successfully debited"));
    }

}

package com.mohan.stock_pilot.wallet.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.dto.PaymentRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wallet")
public class WalletController {

    private final IWalletService walletService;

    @PostMapping
    public ApiResponse createWallet(@AuthenticationPrincipal CustomUserDetails userDetails){
        UUID userId=userDetails.getUser().getId();
        return walletService.createWallet(userId);
    }

    @GetMapping
    public ResponseEntity<Wallet> getWallet(@AuthenticationPrincipal CustomUserDetails userDetails){
        UUID userId=userDetails.getUser().getId();
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

    @GetMapping("/transactions")
    public Page<WalletTransaction> getUserWalletTransaction(@AuthenticationPrincipal CustomUserDetails userDetails,@PageableDefault(
            sort = "createdAt",
            direction = Sort.Direction.DESC
    ) Pageable pageable){
       return walletService.getWalletTransaction(userDetails.getUserId(),pageable);
    }

}

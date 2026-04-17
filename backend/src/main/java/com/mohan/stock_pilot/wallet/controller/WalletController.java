package com.mohan.stock_pilot.wallet.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.service.IWalletService;
import lombok.RequiredArgsConstructor;
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
    public Wallet getWallet(@RequestParam("userId") UUID userId){
        return walletService.getWallet(userId);
    }
}

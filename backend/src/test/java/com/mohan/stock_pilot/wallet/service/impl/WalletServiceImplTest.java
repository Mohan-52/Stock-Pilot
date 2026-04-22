package com.mohan.stock_pilot.wallet.service.impl;

import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.entity.Wallet;
import com.mohan.stock_pilot.wallet.repository.WalletRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class WalletServiceImplTest {

    @Autowired
    private WalletServiceImpl walletService;

    @Autowired
    private WalletRepository walletRepo;

    @Test
    void testConcurrentDebit() throws Exception {

        UUID userId = UUID.fromString("4496544a-6db6-443a-8f79-c11fa5af7fde");

        int threads = 3;
        ExecutorService executor = Executors.newFixedThreadPool(threads);

        Runnable task = () -> {
            try {
                walletService.debitWallet(new DebitRequestDto(userId, 500L));
                System.out.println("SUCCESS");
            } catch (Exception e) {
                System.out.println("FAILED: " + e.getMessage());
            }
        };

        for (int i = 0; i < threads; i++) {
            executor.submit(task);
        }

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        // 🔍 Verify final balance
        Wallet wallet = walletRepo.findByUserId(userId).orElseThrow();

        System.out.println("Final Balance: " + wallet.getBalance());
    }
}
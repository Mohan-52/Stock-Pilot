package com.mohan.stock_pilot.wallet.repository;

import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {
    boolean existsByReferenceId(String transactionId);
}

package com.mohan.stock_pilot.wallet.repository;

import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {
    boolean existsByReferenceId(String transactionId);
    Optional<WalletTransaction>  findByReferenceId(String transactionId);
    Page<WalletTransaction> findAllByWalletId(UUID userId, Pageable pageable);
    List<WalletTransaction> findByWalletIdAndCreatedAtBetweenOrderByCreatedAtAsc(UUID userId, Instant start, Instant end);

}

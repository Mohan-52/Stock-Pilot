package com.mohan.stock_pilot.wallet.dto;

import com.mohan.stock_pilot.wallet.enums.TransactionType;

import java.time.Instant;
import java.util.UUID;

public record WalletTxnDto(
                            UUID id,
                           TransactionType type,
                           long amount,
                           String referenceId,
                           Instant createdAt
) {
}

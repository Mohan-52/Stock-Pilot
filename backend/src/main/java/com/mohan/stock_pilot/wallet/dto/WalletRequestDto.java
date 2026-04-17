package com.mohan.stock_pilot.wallet.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record WalletRequestDto(UUID walletID,UUID userId, BigDecimal balance, String currency) {
}

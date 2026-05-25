package com.mohan.stock_pilot.wallet.dto;

import java.util.List;

public record WalletTxnResponseDto(
        List<WalletTxnDto> content,
        int page,
        int size,
        long  totalElements,
        int totalPages,
        boolean last
){}

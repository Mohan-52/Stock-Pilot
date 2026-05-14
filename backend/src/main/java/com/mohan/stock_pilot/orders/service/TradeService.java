package com.mohan.stock_pilot.orders.service;

import com.mohan.stock_pilot.orders.dto.TradeDto;
import com.mohan.stock_pilot.orders.dto.TradesResponseDto;
import com.mohan.stock_pilot.orders.entity.Trade;
import com.mohan.stock_pilot.orders.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TradeService {
    private final TradeRepository tradeRepo;

    public TradesResponseDto getTrades(UUID userId, Pageable pageable){
        Page<Trade> page=tradeRepo.findByUserId(userId,pageable);

        List<TradeDto> dtoList=page.getContent()
                .stream()
                .map(trade-> new TradeDto(
                        trade.getId(),
                        trade.getOrderId(),
                        trade.getSymbol(),
                        trade.getQuantity(),
                        trade.getPriceInCents(),
                        trade.getExecutedAt()
                )).toList();

        return new TradesResponseDto(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}

package com.mohan.stock_pilot.orders.service;

import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.orders.dto.BuyOrderRequestDto;
import com.mohan.stock_pilot.orders.dto.OrderResponseDto;
import com.mohan.stock_pilot.orders.entity.Order;
import com.mohan.stock_pilot.orders.entity.Trade;
import com.mohan.stock_pilot.orders.enums.OrderStatus;
import com.mohan.stock_pilot.orders.enums.OrderType;
import com.mohan.stock_pilot.orders.repository.OrderRepository;
import com.mohan.stock_pilot.orders.repository.TradeRepository;
import com.mohan.stock_pilot.portfolio.service.PositionService;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.repository.WalletRepository;
import com.mohan.stock_pilot.wallet.service.impl.WalletServiceImpl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final WalletServiceImpl walletService;
    private final MarketDataService marketDataService;
    private final TradeRepository tradeRepo;
    private final PositionService positionService;

    @Transactional
    public OrderResponseDto placeBuyOrder(BuyOrderRequestDto request){

        UUID userId=request.userId();

        long priceInCents=marketDataService.getPriceInCents(request.symbol());

        long totalAmount=priceInCents*request.quantity();

        walletService.debitWallet(new DebitRequestDto(userId, totalAmount));

        Order order=Order.builder()
                .userId(userId)
                .symbol(request.symbol())
                .quantity(request.quantity())
                .type(OrderType.BUY)
                .status(OrderStatus.PENDING)
                .priceInCents(totalAmount).build();

        Order savedOrder= orderRepo.save(order);

        Trade trade=Trade.builder()
                .orderId(savedOrder.getId())
                .userId(userId)
                .symbol(request.symbol())
                .quantity(request.quantity())
                .priceInCents(totalAmount)
                .executedAt(Instant.now())
                .build();

        tradeRepo.save(trade);

        positionService.addPosition(userId, request.symbol(), request.quantity(), totalAmount);

        savedOrder.setStatus(OrderStatus.EXECUTED);

        orderRepo.save(savedOrder);

        return new OrderResponseDto(order.getId(),"EXECUTED");
    }
}

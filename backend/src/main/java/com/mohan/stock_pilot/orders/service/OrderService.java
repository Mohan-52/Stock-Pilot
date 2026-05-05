package com.mohan.stock_pilot.orders.service;

import com.mohan.stock_pilot.common.exception.InsufficientBalanceEx;
import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.orders.dto.*;
import com.mohan.stock_pilot.orders.entity.Order;
import com.mohan.stock_pilot.orders.entity.Trade;
import com.mohan.stock_pilot.orders.enums.OrderStatus;
import com.mohan.stock_pilot.orders.enums.OrderType;
import com.mohan.stock_pilot.orders.repository.OrderRepository;
import com.mohan.stock_pilot.orders.repository.TradeRepository;
import com.mohan.stock_pilot.portfolio.entity.Position;
import com.mohan.stock_pilot.portfolio.service.PositionService;
import com.mohan.stock_pilot.wallet.dto.DebitRequestDto;
import com.mohan.stock_pilot.wallet.service.impl.WalletServiceImpl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
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

        UUID userId = request.userId();
        String symbol = request.symbol().toUpperCase();
        long qty = request.quantity();

        long priceInCents = marketDataService.getPriceInCents(symbol);
        long totalAmount = priceInCents * qty;

        // 1. Wallet
        walletService.debitWallet(new DebitRequestDto(userId, totalAmount));

        // 2. Order
        Order savedOrder = orderRepo.save(
                Order.builder()
                        .userId(userId)
                        .symbol(symbol)
                        .quantity(qty)
                        .type(OrderType.BUY)
                        .status(OrderStatus.PENDING)
                        .priceInCents(priceInCents)   //  FIXED
                        .build()
        );

        // 3. Trade
        tradeRepo.save(
                Trade.builder()
                        .orderId(savedOrder.getId())
                        .userId(userId)
                        .symbol(symbol)
                        .quantity(qty)
                        .priceInCents(priceInCents)   // FIXED
                        .executedAt(Instant.now())
                        .build()
        );

        // 4. Portfolio
        positionService.addPosition(userId, symbol, qty, priceInCents); //  FIXED

        // 5. Finalize
        savedOrder.setStatus(OrderStatus.EXECUTED);
        orderRepo.save(savedOrder);

        return new OrderResponseDto(savedOrder.getId(), "EXECUTED");
    }


    @Transactional
    public OrderResponseDto placeSellOrder(SellOrderRequestDto request){

        UUID userId = request.userId();
        String symbol = request.symbol().toUpperCase();
        long qty = request.quantity();

        Position pos = positionService.getPosition(userId, symbol);

        if (pos.getQuantity() < qty) {
            throw new InsufficientBalanceEx("Insufficient quantity to sell");
        }

        long priceInCents = marketDataService.getPriceInCents(symbol);
        long totalAmount = priceInCents * qty;

        // 1. Order
        Order savedOrder = orderRepo.save(
                Order.builder()
                        .userId(userId)
                        .symbol(symbol)
                        .type(OrderType.SELL)
                        .status(OrderStatus.PENDING)
                        .priceInCents(priceInCents)
                        .quantity(qty)
                        .build()
        );

        // 2. Trade
        tradeRepo.save(
                Trade.builder()
                        .orderId(savedOrder.getId())
                        .userId(userId)
                        .priceInCents(priceInCents)
                        .quantity(qty)
                        .symbol(symbol)
                        .executedAt(Instant.now())
                        .build()
        );

        // 3. Portfolio
        pos.setQuantity(pos.getQuantity() - qty);
        positionService.removePosition(pos);

        // 4. Wallet
        walletService.creditWallet(userId, totalAmount);

        // 5. Finalize
        savedOrder.setStatus(OrderStatus.EXECUTED);
        orderRepo.save(savedOrder);

        return new OrderResponseDto(savedOrder.getId(), "EXECUTED");
    }

    public PortfolioOrdersResponse getOrders(UUID userId, OrderStatus status, OrderType type,Pageable pageable){
        Page<Order> page;

        if (status != null && type != null) {
            page = orderRepo.findAllByUserIdAndStatusAndType(userId, status, type, pageable);
        } else if (status != null) {
            page = orderRepo.findAllByUserIdAndStatus(userId, status, pageable);
        } else if (type != null) {
            page = orderRepo.findAllByUserIdAndType(userId, type, pageable);
        } else {
            page = orderRepo.findAllByUserId(userId, pageable);
        }

        List<OrderHistoryDto> dtoList=page.getContent()
                .stream()
                .map(this::mapToOrderHistory)
                .toList();

        return  new PortfolioOrdersResponse(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    public OrderHistoryDto mapToOrderHistory(Order order){
        return new OrderHistoryDto(
                order.getId(),
                order.getSymbol(),
                order.getType().name(),
                order.getQuantity(),
                order.getPriceInCents(),
                order.getStatus().name(),
                order.getCreatedAt()
        );
    }
}

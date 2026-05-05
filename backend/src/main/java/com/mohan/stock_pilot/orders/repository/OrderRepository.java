package com.mohan.stock_pilot.orders.repository;

import com.mohan.stock_pilot.orders.entity.Order;
import com.mohan.stock_pilot.orders.enums.OrderStatus;
import com.mohan.stock_pilot.orders.enums.OrderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findAllByUserId(UUID userId, Pageable pageable);
    Page<Order> findAllByUserIdAndStatus(UUID userId, OrderStatus status, Pageable pageable);
    Page<Order> findAllByUserIdAndStatusAndType(UUID userId, OrderStatus status, OrderType type, Pageable pageable);
    Page<Order> findAllByUserIdAndType(UUID userId, OrderType type, Pageable pageable);
}

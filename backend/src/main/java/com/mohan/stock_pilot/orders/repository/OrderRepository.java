package com.mohan.stock_pilot.orders.repository;

import com.mohan.stock_pilot.orders.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}

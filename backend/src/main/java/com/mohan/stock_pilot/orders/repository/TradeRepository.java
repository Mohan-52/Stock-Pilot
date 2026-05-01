package com.mohan.stock_pilot.orders.repository;

import com.mohan.stock_pilot.orders.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
}

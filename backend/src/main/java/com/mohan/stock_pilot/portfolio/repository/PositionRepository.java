package com.mohan.stock_pilot.portfolio.repository;

import com.mohan.stock_pilot.portfolio.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PositionRepository extends JpaRepository<Position, UUID> {
    Optional<Position> findByUserIdAndSymbol(UUID userId, String symbol);
}

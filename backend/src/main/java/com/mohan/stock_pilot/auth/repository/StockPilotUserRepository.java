package com.mohan.stock_pilot.auth.repository;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StockPilotUserRepository extends JpaRepository<StockPilotUser, UUID> {
    boolean existsByEmail(String email);
}

package com.mohan.stock_pilot.auth.repository;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockPilotUserRepository extends JpaRepository<StockPilotUser, UUID> {
    boolean existsByEmail(String email);
    Optional<StockPilotUser> findByEmail(String email);

    @Query("SELECT u FROM StockPilotUser u JOIN FETCH u.role WHERE u.email = :email")
    Optional<StockPilotUser> findUserWithRole(@Param("email") String email);
}

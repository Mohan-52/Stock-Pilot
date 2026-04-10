package com.mohan.stock_pilot.marketdata.repository;

import com.mohan.stock_pilot.marketdata.entity.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    Optional<Instrument> findTopByProfileEnrichedFalseAndActiveTrue();
}

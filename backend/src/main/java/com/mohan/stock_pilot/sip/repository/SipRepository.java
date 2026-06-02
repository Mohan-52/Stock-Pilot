package com.mohan.stock_pilot.sip.repository;

import com.mohan.stock_pilot.sip.dto.SipDto;
import com.mohan.stock_pilot.sip.entity.Sip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface SipRepository extends JpaRepository<Sip, UUID> {
    boolean existsByUserIdAndInstrumentId(UUID userId, UUID instrumentId);

    @Query("""
    SELECT new com.mohan.stock_pilot.sip.dto.SipDto(
        s.id,
        s.instrumentId,
        i.symbol,
        i.companyName,
        s.amountPerCycle,
        s.frequency,
        s.nextExecutionDate,
        s.status
    )
    FROM Sip s
    JOIN Instrument i
        ON s.instrumentId = i.id
    WHERE s.userId = :userId
""")
    Page<SipDto> findSipDtosByUserId(
            UUID userId,
            Pageable pageable
    );}

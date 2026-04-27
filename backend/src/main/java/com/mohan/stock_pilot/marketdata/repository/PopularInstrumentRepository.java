package com.mohan.stock_pilot.marketdata.repository;

import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.entity.PopularInstrument;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PopularInstrumentRepository extends JpaRepository<PopularInstrument, UUID> {
    @Query("""
    SELECT pi.instrument
    FROM PopularInstrument pi
    WHERE pi.category = :category
    AND pi.active = true
    ORDER BY pi.rank
""")
    List<Instrument> findInstrumentsByCategory(MarketCategory category);
}

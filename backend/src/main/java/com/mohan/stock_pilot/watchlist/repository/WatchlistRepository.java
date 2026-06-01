package com.mohan.stock_pilot.watchlist.repository;

import com.mohan.stock_pilot.watchlist.dto.WatchlistStockDto;
import com.mohan.stock_pilot.watchlist.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, UUID> {

    List<Watchlist> findByUserId(
            UUID userId
    );

    boolean existsByUserIdAndInstrumentSymbol(
            UUID userId,
            String symbol
    );

    void deleteByUserIdAndInstrumentSymbol(
            UUID userId,
            String symbol
    );

    @Query("""
       SELECT new com.mohan.stock_pilot.watchlist.dto.WatchlistStockDto(
            i.symbol,
            i.name
       )
       FROM Watchlist w
       JOIN w.instrument i
       WHERE w.user.id = :userId
       """)
    List<WatchlistStockDto> findWatchlistStocks(
            UUID userId
    );

    @Query("""
       SELECT i.symbol
       FROM Watchlist w
       JOIN w.instrument i
       WHERE w.user.id = :userId
       """)
    List<String> findSymbolsByUserId(
            UUID userId
    );
}

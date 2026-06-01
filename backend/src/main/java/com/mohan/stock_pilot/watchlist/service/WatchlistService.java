package com.mohan.stock_pilot.watchlist.service;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.common.exception.ResourceAlreadyExistsEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.repository.InstrumentRepository;
import com.mohan.stock_pilot.watchlist.dto.WatchlistStockDto;
import com.mohan.stock_pilot.watchlist.entity.Watchlist;
import com.mohan.stock_pilot.watchlist.repository.WatchlistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final WatchlistRepository watchlistRepo;
    private final InstrumentRepository instrumentRepo;


    public void addToWatchlist(StockPilotUser user, String symbol){

        if(watchlistRepo.existsByUserIdAndInstrumentSymbol(user.getId(), symbol)){
            throw new ResourceAlreadyExistsEx("Stock already added to watchlist");
        };

        Instrument instrument=instrumentRepo.findBySymbol(symbol)
                .orElseThrow(()->new ResourceNotFoundEx("Symbol not found"));

        Watchlist watchlist=Watchlist.builder()
                .instrument(instrument)
                .user(user)
                .build();

        watchlistRepo.save(watchlist);

    }

    @Transactional
    public void removeFromWatchlist(UUID userId, String symbol){
        watchlistRepo.deleteByUserIdAndInstrumentSymbol(userId,symbol);
    }

    public List<WatchlistStockDto> watchListStocks(UUID userId){
        return watchlistRepo.findWatchlistStocks(
                        userId
                );

    }
}

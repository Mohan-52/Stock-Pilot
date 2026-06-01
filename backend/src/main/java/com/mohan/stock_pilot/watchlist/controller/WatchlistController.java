package com.mohan.stock_pilot.watchlist.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.watchlist.dto.WatchlistStockDto;
import com.mohan.stock_pilot.watchlist.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {
    private final WatchlistService watchlistService;

    @PostMapping
    public ApiResponse addToWatchlist(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam("symbol") String symbol){
        watchlistService.addToWatchlist(userDetails.getUser(),symbol);

        return new ApiResponse("Successfully added "+symbol+" to watchlist");
    }

    @DeleteMapping
    public ApiResponse removeFromWatchlist(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam("symbol") String symbol){
        watchlistService.removeFromWatchlist(userDetails.getUserId(),symbol);
        return new ApiResponse("Successfully removed "+symbol+" from watchlist");
    }

    @GetMapping
    public List<WatchlistStockDto> getWatchlist(@AuthenticationPrincipal CustomUserDetails userDetails){
        return watchlistService.watchListStocks(userDetails.getUserId());
    }
}

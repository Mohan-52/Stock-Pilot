package com.mohan.stock_pilot.portfolio.service;

import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.portfolio.dto.PortfolioPositionDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioSummaryDto;
import com.mohan.stock_pilot.portfolio.entity.Position;
import com.mohan.stock_pilot.portfolio.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PositionRepository positionRepo;
    private final MarketDataService marketDataService;

    public PortfolioResponseDto getPortfolio(UUID userId){
        List<Position> positions=positionRepo.findByUserId(userId);

        long totalInvested=0;
        long totalCurrentValue=0;

        List<PortfolioPositionDto> responseList=new ArrayList<>();

        for (Position pos: positions){
            String symbol=pos.getSymbol();

            long qty=pos.getQuantity();

            long avgPrice=pos.getAvgPriceInCents();

            long currentPrice= marketDataService.getPriceInCents(symbol);

            long invested=qty * avgPrice;
            long currentValue= qty *currentPrice;
            long pnl=currentValue-invested;


            double pnlPercentage = invested == 0 ? 0 : ((double) pnl / invested) * 100;

            totalInvested+=invested;
            totalCurrentValue+=currentValue;

            responseList.add(
                    new PortfolioPositionDto(symbol, qty, avgPrice, currentPrice,invested, currentValue, pnl, pnlPercentage )
            );


        }

        long totalPnl=totalCurrentValue-totalInvested;

        return new PortfolioResponseDto(
                totalInvested,
                totalCurrentValue,
                totalPnl,
                responseList
        );
    }


    public PortfolioSummaryDto getPortfolioSummary(UUID userId) {

        List<Position> positions = positionRepo.findByUserId(userId);

        long totalInvested = 0;
        long totalCurrentValue = 0;

        for (Position pos : positions) {

            long qty = pos.getQuantity();
            long avgPrice = pos.getAvgPriceInCents();

            long currentPrice = marketDataService.getPriceInCents(pos.getSymbol());

            long invested = qty * avgPrice;
            long currentValue = qty * currentPrice;

            totalInvested += invested;
            totalCurrentValue += currentValue;
        }

        long totalPnl = totalCurrentValue - totalInvested;

        double pnlPercentage = totalInvested == 0 ? 0 : ((double) totalPnl / totalInvested) * 100;


        return new PortfolioSummaryDto(
                totalInvested,
                totalCurrentValue,
                totalPnl,
                pnlPercentage
        );
    }

    public Page<PortfolioPositionDto> getPositions(UUID userId, Pageable pageable) {

        Page<Position> positionPage = positionRepo.findByUserId(userId, pageable);

        List<Position> positions = positionPage.getContent();

        if (positions.isEmpty()) {
            return Page.empty(pageable);
        }

        Set<String> symbols = positions.stream()
                .map(Position::getSymbol)
                .collect(Collectors.toSet());

        // Batch fetch prices
        Map<String, Long> priceMap = marketDataService.getPrices(symbols);

        // Map to DTO
        List<PortfolioPositionDto> dtoList = positions.stream().map(pos -> {

            long qty = pos.getQuantity();
            long avgPrice = pos.getAvgPriceInCents();

            long currentPrice = priceMap.getOrDefault(pos.getSymbol(), 0L);

            long invested = qty * avgPrice;
            long currentValue = qty * currentPrice;
            long pnl = currentValue - invested;

            double pnlPercentage = invested == 0
                    ? 0
                    : ((double) pnl / invested) * 100;

            return new PortfolioPositionDto(
                    pos.getSymbol(),
                    qty,
                    avgPrice,
                    currentPrice,
                    invested,
                    currentValue,
                    pnl,
                    pnlPercentage
            );

        }).toList();

        return new PageImpl<>(dtoList, pageable, positionPage.getTotalElements());
    }
}

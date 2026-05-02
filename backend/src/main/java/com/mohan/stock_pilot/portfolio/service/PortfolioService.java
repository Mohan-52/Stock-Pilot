package com.mohan.stock_pilot.portfolio.service;

import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.portfolio.dto.PortfolioPositionDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.entity.Position;
import com.mohan.stock_pilot.portfolio.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

}

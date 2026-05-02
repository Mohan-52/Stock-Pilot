package com.mohan.stock_pilot.portfolio.service;

import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.portfolio.dto.PortfolioPositionDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.entity.Position;
import com.mohan.stock_pilot.portfolio.repository.PositionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepo;

    @Transactional
    public void addPosition(UUID userId, String symbol, long qty, long price){
        Optional<Position> existing=positionRepo.findByUserIdAndSymbol(userId,symbol);

        if(existing.isPresent()){
            Position pos=existing.get();

            long newQnt=pos.getQuantity()+qty;

            long totalCost=(pos.getQuantity()*pos.getAvgPriceInCents())+(qty*price);

            long newAvg=totalCost/newQnt;

            pos.setQuantity(newQnt);
            pos.setAvgPriceInCents(newAvg);

            positionRepo.save(pos);
        }else{
            Position pos=Position.builder()
                    .userId(userId)
                    .symbol(symbol)
                    .quantity(qty)
                    .avgPriceInCents(price)
                    .build();

            positionRepo.save(pos);
        }

    }

    public Position getPosition(UUID userId, String symbol){
        return positionRepo.findByUserIdAndSymbol(userId,symbol)
                .orElseThrow(()->new ResourceNotFoundEx("User doesn't have holding of "+symbol+ " stocks"));
    }

    @Transactional
    public void removePosition(Position position){
        if(position.getQuantity()==0){
            positionRepo.delete(position);
        }else{
            positionRepo.save(position);
        }

    }


}

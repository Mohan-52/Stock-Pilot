package com.mohan.stock_pilot.marketdata.publisher;

import com.mohan.stock_pilot.marketdata.dto.StockPriceUpdateDto;
import com.mohan.stock_pilot.marketdata.dto.StockResponseDto;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockWebSocketPublisher {
    private final SimpMessagingTemplate messagingTemplate;

    public void publishStockUpdate(
            MarketCategory category,
            StockPriceUpdateDto stock
    ){
        messagingTemplate.convertAndSend(
                "/topic/stocks/"+category,
                stock
        );
    }
}

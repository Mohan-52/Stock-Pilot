package com.mohan.stock_pilot.orders.contoller;

import com.mohan.stock_pilot.orders.dto.TradesResponseDto;
import com.mohan.stock_pilot.orders.service.TradeService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import io.lettuce.core.GeoArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
public class TradeController {
    private final TradeService tradeService;

    @GetMapping
    public TradesResponseDto getTrades(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @PageableDefault(size = 10, sort = "executedAt", direction = Sort.Direction.DESC)
                                       Pageable pageable){

        return tradeService.getTrades(userDetails.getUserId(),pageable);

    }
}

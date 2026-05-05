package com.mohan.stock_pilot.orders.contoller;

import com.mohan.stock_pilot.orders.dto.BuyOrderRequestDto;
import com.mohan.stock_pilot.orders.dto.OrderResponseDto;
import com.mohan.stock_pilot.orders.dto.PortfolioOrdersResponse;
import com.mohan.stock_pilot.orders.dto.SellOrderRequestDto;
import com.mohan.stock_pilot.orders.enums.OrderStatus;
import com.mohan.stock_pilot.orders.enums.OrderType;
import com.mohan.stock_pilot.orders.service.OrderService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import io.lettuce.core.GeoArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrderService orderService;

    @PostMapping("/buy")
    public ResponseEntity<OrderResponseDto> buy(@RequestBody BuyOrderRequestDto req){
        return ResponseEntity.ok(orderService.placeBuyOrder(req));
    }

    @PostMapping("/sell")
    public ResponseEntity<OrderResponseDto> sell(@RequestBody SellOrderRequestDto req){
        return ResponseEntity.ok(orderService.placeSellOrder(req));
    }

    @GetMapping
    public PortfolioOrdersResponse getOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "status", required = false) OrderStatus status,
            @RequestParam(value = "type", required = false) OrderType type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable){
        return orderService.getOrders(userDetails.getUserId(), status, type, pageable);
    }


}

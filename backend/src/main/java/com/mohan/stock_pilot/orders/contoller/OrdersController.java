package com.mohan.stock_pilot.orders.contoller;

import com.mohan.stock_pilot.orders.dto.BuyOrderRequestDto;
import com.mohan.stock_pilot.orders.dto.OrderResponseDto;
import com.mohan.stock_pilot.orders.dto.SellOrderRequestDto;
import com.mohan.stock_pilot.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

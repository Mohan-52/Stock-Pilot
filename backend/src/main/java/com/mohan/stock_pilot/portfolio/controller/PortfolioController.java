package com.mohan.stock_pilot.portfolio.controller;

import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {
    private final PortfolioService portfolioService;

    @GetMapping
    public PortfolioResponseDto getPortfolio(@RequestParam UUID userId){
        return portfolioService.getPortfolio(userId);
    }
}

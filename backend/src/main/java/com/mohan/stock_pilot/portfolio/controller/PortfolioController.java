package com.mohan.stock_pilot.portfolio.controller;

import com.mohan.stock_pilot.portfolio.dto.PortfolioPositionDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioSummaryDto;
import com.mohan.stock_pilot.portfolio.service.PortfolioService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping("/summary")
    public PortfolioSummaryDto getSummary(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return portfolioService.getPortfolioSummary(user.getUserId());
    }

    @GetMapping("/positions")
    public Page<PortfolioPositionDto> getPositions(
            @AuthenticationPrincipal CustomUserDetails user,
            Pageable pageable
    ) {
        return portfolioService.getPositions(user.getUserId(), pageable);
    }

}

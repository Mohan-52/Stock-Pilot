package com.mohan.stock_pilot.reports.controller;

import com.mohan.stock_pilot.reports.service.ReportService;
import com.mohan.stock_pilot.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/portfolio/pdf")
    public ResponseEntity<byte[]> downloadPortfolioPdf(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        byte[] pdfBytes= reportService.generatePortfolioPdf(customUserDetails.getUserId());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=portfolio-statement.pdf"
                ).contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(pdfBytes);


    }

    @GetMapping("/wallet-transactions/excel")
    public ResponseEntity<byte[]> downloadWalletTransactionsExcel(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @AuthenticationPrincipal CustomUserDetails user) {

        byte[] excel =
                reportService.generateWalletTransactionsExcel(
                        user.getUserId(),
                        from,
                        to);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=wallet-transactions.xlsx")
                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }
}

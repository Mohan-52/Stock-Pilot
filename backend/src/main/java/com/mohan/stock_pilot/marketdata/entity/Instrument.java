package com.mohan.stock_pilot.marketdata.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@Table(
        name = "instruments",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_instrument_symbol_exchange", columnNames = {"symbol", "exchange"})
        },
        indexes = {
                @Index(name = "idx_instrument_symbol", columnList = "symbol"),
                @Index(name = "idx_instrument_name", columnList = "name"),
                @Index(name = "idx_instrument_exchange", columnList = "exchange"),
                @Index(name = "idx_instrument_active", columnList = "active")
        }
)
public class Instrument extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 30)
    private String symbol; // TSLA, AAPL

    @Column(name = "display_symbol", nullable = false, length = 100)
    private String displaySymbol; // NASDAQ NMS - GLOBAL MARKET:TSLA

    @Column(nullable = false, length = 150)
    private String name; // Tesla Inc

    @Column(nullable = false, length = 100)
    private String exchange; // NASDAQ NMS - GLOBAL MARKET

    @Column(nullable = false, length = 20)
    private String type; // EQUITY

    // Region / classification
    @Column(nullable = false, length = 10)
    private String currency; // USD

    @Column(length = 50)
    private String country; // US

    @Column(length = 120)
    private String industry; // Automobiles

    // Company metadata
    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "ipo_date")
    private LocalDate ipoDate;


    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;


}

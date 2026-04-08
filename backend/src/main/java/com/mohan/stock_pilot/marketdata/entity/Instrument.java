package com.mohan.stock_pilot.marketdata.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "instruments",
        indexes = {
                @Index(name = "idx_instrument_symbol", columnList = "symbol"),
                @Index(name = "idx_instrument_name", columnList = "name"),
                @Index(name = "idx_instrument_exchange", columnList = "exchange"),
                @Index(name = "idx_instrument_profile_enriched", columnList = "profile_enriched")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instrument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String symbol; // TSLA, AAPL

    @Column(name = "display_symbol", nullable = false, length = 100)
    private String displaySymbol; // TSLA

    @Column(nullable = false, length = 150)
    private String name; // Tesla Inc

    @Column(nullable = false, length = 100)
    private String exchange; // US, NASDAQ, NYSE

    @Column(nullable = false, length = 50)
    private String type; // Common Stock

    @Column(nullable = false, length = 10)
    private String currency; // USD

    @Column(length = 20)
    private String mic; // XNAS, XNYS, OOTC

    @Column(length = 50)
    private String figi; // BBG000N9MNX3

    @Column(length = 20)
    private String isin; // optional

    @Column(length = 50)
    private String country; // US

    @Column(length = 120)
    private String industry; // Automobiles

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "ipo_date")
    private LocalDate ipoDate;

    @Column(name = "profile_enriched", nullable = false)
    @Builder.Default
    private Boolean profileEnriched = false;

    @Column(name = "profile_last_updated_at")
    private LocalDateTime profileLastUpdatedAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
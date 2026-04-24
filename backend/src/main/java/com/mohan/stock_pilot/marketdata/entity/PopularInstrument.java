package com.mohan.stock_pilot.marketdata.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import com.mohan.stock_pilot.marketdata.enums.MarketCategory;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Entity
@Table(
        name = "popular_instruments",
        indexes = {
                @Index(name = "idx_category_rank", columnList = "category, rank"),
                @Index(name = "idx_category_active", columnList = "category, active")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_instrument_category", columnNames = {"instrument_id", "category"})
        }
)
@Data
@EqualsAndHashCode(callSuper = true)
public class PopularInstrument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instrument_id", nullable = false)
    private Instrument instrument;

    @Column(nullable = false)
    private Integer rank;

    @Column(nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MarketCategory category;
}
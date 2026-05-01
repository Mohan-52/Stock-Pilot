package com.mohan.stock_pilot.portfolio.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "positions",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_user_symbol", columnNames = {"user_id", "symbol"})
    },
        indexes = {
                @Index(name = "idx_positions_user", columnList = "user_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Position extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private long quantity;

    @Column(name = "avg_price_in_cents", nullable = false)
    private long avgPriceInCents;
}

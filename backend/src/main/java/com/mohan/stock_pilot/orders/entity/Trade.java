package com.mohan.stock_pilot.orders.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "trades", indexes = {
        @Index(name = "idx_trade_order", columnList = "orderId"),
        @Index(name = "idx_trade_user", columnList = "userId")
})
public class Trade extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private long quantity;

    @Column(nullable = false)
    private long priceInCents;

    private Instant executedAt;
}
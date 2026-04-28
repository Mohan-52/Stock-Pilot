package com.mohan.stock_pilot.orders.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import com.mohan.stock_pilot.orders.enums.OrderStatus;
import com.mohan.stock_pilot.orders.enums.OrderType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_user", columnList = "userId"),
        @Index(name = "idx_order_symbol", columnList = "symbol")
})
public class Order extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    private OrderType type;

    @Column(nullable = false)
    private long quantity;

    @Column(nullable = false)
    private long priceInCents;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
package com.mohan.stock_pilot.sip.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import com.mohan.stock_pilot.sip.enums.SipExecutionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sip_executions")
public class SipExecution extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID sipId;

    @Column(nullable = false)
    private Instant executionTime;

    @Column(nullable = false)
    private long stockPrice;

    @Column(nullable = false)
    private long quantity;

    private long investedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SipExecutionStatus status;

    @Column(length = 255)
    private String failureReason;

}

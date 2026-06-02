package com.mohan.stock_pilot.sip.entity;

import com.mohan.stock_pilot.common.entity.BaseEntity;
import com.mohan.stock_pilot.sip.enums.SipFrequency;
import com.mohan.stock_pilot.sip.enums.SipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "sips",
        indexes = {
                @Index(
                        name = "idx_sip_status_next_execution",
                        columnList = "status,next_execution_date"
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Sip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID instrumentId;

    @Column(nullable = false)
    private long amountPerCycle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SipFrequency frequency;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private Instant nextExecutionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SipStatus status;
}

package com.mohan.stock_pilot.auth.entity;

import com.mohan.stock_pilot.auth.enums.AccountStatus;
import com.mohan.stock_pilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class StockPilotUser extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fullName;

    private String email;

    private String password;

    private String profileImageUrl;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Roles role;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;

    private boolean emailVerified;
}

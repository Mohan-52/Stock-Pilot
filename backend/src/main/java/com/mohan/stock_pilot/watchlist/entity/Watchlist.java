package com.mohan.stock_pilot.watchlist.entity;

import com.mohan.stock_pilot.auth.entity.StockPilotUser;
import com.mohan.stock_pilot.common.entity.BaseEntity;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "watchlists",
        indexes = {

                @Index(
                        name = "idx_watchlist_user",
                        columnList = "user_id"
                ),

                @Index(
                        name = "idx_watchlist_instrument",
                        columnList = "instrument_id"
                )

        }
)
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Watchlist extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private StockPilotUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "instrument_id",
            nullable = false
    )
    private Instrument instrument;

}

CREATE TABLE watchlists (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,
    instrument_id UUID NOT NULL,

    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),

    CONSTRAINT fk_watchlist_user
        FOREIGN KEY(user_id)
        REFERENCES stock_pilot_user(id),

    CONSTRAINT fk_watchlist_instrument
        FOREIGN KEY(instrument_id)
        REFERENCES instruments(id),

    CONSTRAINT uk_watchlist_user_instrument
        UNIQUE(user_id, instrument_id)
);

CREATE INDEX idx_watchlist_user
ON watchlists(user_id);

CREATE TABLE positions (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,

    quantity BIGINT NOT NULL,
    avg_price_in_cents BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP,
    updated_by VARCHAR(50),

    CONSTRAINT uk_user_symbol UNIQUE (user_id, symbol)
);

CREATE INDEX idx_positions_user_id ON positions(user_id);
CREATE INDEX idx_positions_symbol ON positions(symbol);
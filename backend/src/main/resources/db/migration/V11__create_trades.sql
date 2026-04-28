CREATE TABLE trades (
    id UUID PRIMARY KEY,

    order_id UUID NOT NULL,
    user_id UUID NOT NULL,

    symbol VARCHAR(20) NOT NULL,
    quantity BIGINT NOT NULL,

    price_in_cents BIGINT NOT NULL,

    executed_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP,
    updated_by VARCHAR(50),

    CONSTRAINT fk_trades_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Indexes
CREATE INDEX idx_trades_order_id ON trades(order_id);
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);


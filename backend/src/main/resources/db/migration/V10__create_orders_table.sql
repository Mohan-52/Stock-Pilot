CREATE TABLE orders (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,

    type VARCHAR(10) NOT NULL,
    quantity BIGINT NOT NULL,

    price_in_cents BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP,
    updated_by VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_symbol ON orders(symbol);
CREATE INDEX idx_orders_status ON orders(status);
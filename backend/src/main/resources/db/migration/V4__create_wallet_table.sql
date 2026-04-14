CREATE TABLE wallet (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL UNIQUE,

    balance DECIMAL(19, 4) NOT NULL,

    currency VARCHAR(10) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20)
);

CREATE INDEX idx_wallet_user_id ON wallet(user_id);
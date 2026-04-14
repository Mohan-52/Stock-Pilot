CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY,

    wallet_id UUID NOT NULL,

    type VARCHAR(20) NOT NULL,

    amount DECIMAL(19, 4) NOT NULL,

    status VARCHAR(20) NOT NULL,

    reference_id VARCHAR(255),

    description VARCHAR(255),

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),

    CONSTRAINT fk_wallet_transactions_wallet
        FOREIGN KEY (wallet_id)
        REFERENCES wallet(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_wallet_transactions_wallet_id
ON wallet_transactions(wallet_id);

CREATE INDEX idx_wallet_transactions_status
ON wallet_transactions(status);

CREATE INDEX idx_wallet_transactions_reference_id
ON wallet_transactions(reference_id);

CREATE INDEX idx_wallet_transactions_wallet_created
ON wallet_transactions(wallet_id, created_at DESC);
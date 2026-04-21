-- V6__recreate_wallet_tables.sql

DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS wallet;

CREATE TABLE wallet (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL UNIQUE,

    balance BIGINT NOT NULL,

    currency VARCHAR(10) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20)
);

CREATE INDEX idx_wallet_user_id ON wallet(user_id);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY,

    wallet_id UUID NOT NULL,

    type VARCHAR(20) NOT NULL,

    amount BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    reference_id VARCHAR(255) UNIQUE NOT NULL,
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
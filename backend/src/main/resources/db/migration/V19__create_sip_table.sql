CREATE TABLE sips (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    symbol VARCHAR(20) NOT NULL,

    amount_per_cycle BIGINT NOT NULL,

    frequency VARCHAR(20) NOT NULL,

    start_date DATE NOT NULL,

    next_execution_date TIMESTAMP WITH TIME ZONE NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),

    CONSTRAINT chk_sip_amount
        CHECK (amount_per_cycle > 0),

    CONSTRAINT chk_sip_frequency
        CHECK (frequency IN ('DAILY','WEEKLY','MONTHLY')),

    CONSTRAINT chk_sip_status
        CHECK (status IN ('ACTIVE','PAUSED','CANCELLED'))
);

CREATE INDEX idx_sip_status_next_execution
ON sips(status, next_execution_date);

CREATE INDEX idx_sip_user
ON sips(user_id);
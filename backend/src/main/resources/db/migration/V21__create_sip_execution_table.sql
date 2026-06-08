CREATE TABLE sip_executions (
    id UUID PRIMARY KEY,

    sip_id UUID NOT NULL,

    execution_time TIMESTAMP WITH TIME ZONE NOT NULL,

    stock_price BIGINT NOT NULL,

    quantity BIGINT NOT NULL,

    invested_amount BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    failure_reason VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),

    CONSTRAINT chk_sip_execution_status
        CHECK (status IN ('SUCCESS', 'FAILED'))
);

CREATE INDEX idx_sip_execution_sip
ON sip_executions(sip_id);

CREATE INDEX idx_sip_execution_time
ON sip_executions(execution_time DESC);


CREATE TABLE popular_instruments (
    id UUID PRIMARY KEY,

    instrument_id UUID NOT NULL,

    category VARCHAR(50) NOT NULL,

    rank INTEGER NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by VARCHAR(50) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),

    CONSTRAINT fk_popular_instrument_instrument
        FOREIGN KEY (instrument_id)
        REFERENCES instruments(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_instrument_category
        UNIQUE (instrument_id, category)
);


CREATE INDEX idx_category_rank
    ON popular_instruments (category, rank);


CREATE INDEX idx_category_active
    ON popular_instruments (category, active);
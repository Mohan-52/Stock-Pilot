CREATE TABLE instruments (
    id UUID PRIMARY KEY,

    symbol VARCHAR(30) NOT NULL,
    display_symbol VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    exchange VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,

    currency VARCHAR(10) NOT NULL,
    mic VARCHAR(20),
    figi VARCHAR(50),
    isin VARCHAR(20),

    country VARCHAR(50),
    industry VARCHAR(120),

    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    ipo_date DATE,

    profile_enriched BOOLEAN NOT NULL DEFAULT FALSE,
    profile_last_updated_at TIMESTAMP WITH TIME ZONE,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by VARCHAR(50),

    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),

    CONSTRAINT uk_instrument_symbol UNIQUE (symbol)
);

CREATE INDEX idx_instrument_symbol ON instruments(symbol);
CREATE INDEX idx_instrument_name ON instruments(name);
CREATE INDEX idx_instrument_exchange ON instruments(exchange);
CREATE INDEX idx_instrument_active ON instruments(active);
CREATE INDEX idx_instrument_profile_enriched ON instruments(profile_enriched);
CREATE INDEX idx_instrument_mic ON instruments(mic);
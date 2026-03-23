CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20)
);

CREATE TABLE stock_pilot_user (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    profile_image_url VARCHAR(255),

    role_id UUID,
    account_status VARCHAR(20),
    email_verified BOOLEAN,

    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),

    CONSTRAINT fk_user_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
);

-- Seed roles
INSERT INTO roles (id, name, description, created_at, created_by)
VALUES
    (gen_random_uuid(), 'ADMIN', 'System administrator', NOW(), 'SYSTEM'),
    (gen_random_uuid(), 'USER', 'Default user', NOW(), 'SYSTEM');
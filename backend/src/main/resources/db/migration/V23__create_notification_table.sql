CREATE TABLE notifications (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    title VARCHAR(100) NOT NULL,

    message VARCHAR(500) NOT NULL,

    type VARCHAR(50) NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX idx_notifications_user_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_notifications_created_at
    ON notifications(created_at DESC);
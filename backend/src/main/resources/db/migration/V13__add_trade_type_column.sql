ALTER TABLE trades
ADD COLUMN type VARCHAR(30);

UPDATE trades t
SET type = o.type
FROM orders o
WHERE t.order_id = o.id;

ALTER TABLE trades
ALTER COLUMN type SET NOT NULL;
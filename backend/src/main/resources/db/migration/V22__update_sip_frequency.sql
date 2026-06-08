ALTER TABLE sips
DROP CONSTRAINT chk_sip_frequency;

ALTER TABLE sips
ADD CONSTRAINT chk_sip_frequency
CHECK (
    frequency IN (
        'MINUTELY',
        'DAILY',
        'WEEKLY',
        'MONTHLY'
    )
);
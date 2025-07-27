CREATE TABLE IF NOT EXISTS envelopes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(255),
    money decimal(7, 2)
);

CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    envelope_id uuid REFERENCES envelopes(id) NOT NULL,
    title varchar(255),
    price decimal(7, 2)
);

CREATE TABLE IF NOT EXISTS envelopes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(255),
    money money
);

CREATE TABLE IF NOT EXISTS transaction (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    envolope_id uuid REFERENCES envelopes(id),
    title varchar(255),
    price money
);

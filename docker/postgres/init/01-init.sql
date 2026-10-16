CREATE TABLE IF NOT EXISTS tables (
  id TEXT PRIMARY KEY,
  capacity INTEGER NOT NULL CHECK (capacity > 0)
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone VARCHAR(10) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 30),
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  table_id TEXT NOT NULL REFERENCES tables(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'arrived', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_phone ON reservations(phone);
CREATE INDEX IF NOT EXISTS idx_reservations_slot ON reservations(reservation_date, reservation_time);

INSERT INTO tables (id, capacity)
VALUES
  ('T1', 2),
  ('T2', 4),
  ('T3', 6),
  ('T4', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reservations (
  customer_name,
  phone,
  reservation_date,
  reservation_time,
  duration_minutes,
  party_size,
  table_id,
  status
)
VALUES
  ('Trần Minh', '0912345678', '2026-10-17', '18:00', 90, 4, 'T2', 'pending'),
  ('Lê Hương', '0987654321', '2026-10-17', '19:30', 120, 2, 'T1', 'confirmed')
ON CONFLICT DO NOTHING;

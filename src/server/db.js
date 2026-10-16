import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Thiếu biến môi trường DATABASE_URL. Hãy tạo file .env.local từ .env.example.');
}

export const pool = new Pool({
  connectionString,
});

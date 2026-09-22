import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const requiredDatabaseFields = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

const hasDatabaseConfiguration = requiredDatabaseFields.every(
  (field) => process.env[field]
);

export const pool = hasDatabaseConfiguration
  ? new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    })
  : null;

export function getDatabaseStatus() {
  return pool ? 'configured' : 'not configured';
}

// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function initDB() {
  const client = await pool.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS market_data (
      timestamp TIMESTAMP PRIMARY KEY,
      silverNY REAL,
      silverLondon REAL,
      silverSHA REAL,
      silverDE REAL,
      silverIN REAL,
      goldNY REAL,
      goldSilverRatio REAL,
      spreadSHA_NY REAL,
      spreadDE_NY REAL,
      spreadIN_NY REAL
    )
  `);

  client.release();
  return pool;
}

export async function insertData(db, data) {
  await db.query(
    `
    INSERT INTO market_data (
      timestamp, silverNY, silverLondon, silverSHA, silverDE, silverIN, goldNY, goldSilverRatio, spreadSHA_NY, spreadDE_NY, spreadIN_NY
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (timestamp) DO NOTHING
    `,
    [
      data.timestamp,
      data.silverNY,
      data.silverLondon,
      data.silverSHA,
      data.silverDE,
      data.silverIN,
      data.goldNY,
      data.goldSilverRatio,
      data.spreadSHA_NY,
      data.spreadDE_NY,
      data.spreadIN_NY      
    ]
  );
}

export async function getLatest(db) {
  const res = await db.query(
    "SELECT * FROM market_data ORDER BY timestamp DESC LIMIT 1"
  );
  return res.rows[0];
}

export async function getHistory(db, limit = 1000) {
  const res = await db.query(
    "SELECT * FROM market_data ORDER BY timestamp ASC LIMIT $1",
    [limit]
  );
  return res.rows;
}

import pg from "pg";
import dotenv from "dotenv";
import { usersTable } from "../migrations/createTables.js";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const connectDB = async () => {
  try {
    const response = await db.query("SELECT NOW()");
    console.log("Database Connected", response.rows[0].now);
  } catch (error) {
    console.error("error connecting to DB", error);
  }
};

export const migration = async () => {
  const client = await db.connect();
  try {
    await client.query(usersTable);
    console.log("User Table Created Successfully");
  } catch (error) {
    console.error("Error creating Table:", error);
  } finally {
    client.release();
  }
};

export const query = (text, params) => db.query(text, params);

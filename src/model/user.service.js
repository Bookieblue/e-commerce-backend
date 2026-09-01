import { db } from "../config/db.js";

export const getAllUsers = async () => {
  const result = await db.query(
    "SELECT id, first_name, last_name, email, gender, role, created_at FROM users",
  );
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await db.query(
    "SELECT id, first_name, last_name, email, gender, role, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

export const updateUser = async (id, updates) => {
  const { first_name, last_name, email, gender, role } = updates;

  const result = await db.query(
    "UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email), gender = COALESCE($4, gender), role = COALESCE($5, role), updated_at = NOW() WHERE id = $6 RETURNING id, first_name, last_name, email, gender, role, created_at",
    [first_name, last_name, email, gender, role, id],
  );
  return result.rows[0];
};

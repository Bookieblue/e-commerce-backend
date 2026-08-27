import { db } from "../config/db.js"
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email) => {
    const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return response.rows[0];
}

export const createUser = async ({
    first_name, last_name, email, password, gender, role
}) => {

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await db.query(
        `INSERT INTO users (first_name, last_name, email, password, gender, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, gender, role`,
        [first_name, last_name, email, hashedPassword, gender, role]
    );

    return response.rows[0];
};
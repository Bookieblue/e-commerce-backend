import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email) => {
  const response = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return response.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};
export const createUser = async ({
  first_name,
  last_name,
  email,
  password,
  gender,
  role,
  otp_code,
  otp_expires,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await db.query(
    `INSERT INTO users (first_name, last_name, email, password, gender, role,otp_code, otp_expires) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING id, first_name, last_name, email, gender, role,is_verified,created_at `,
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      gender,
      role || "customer",
      otp_code || null,
      otp_expires || null,
    ],
  );

  return response.rows[0];
};

export const updateRefreshToken = async (userId, refreshToken) => {
  await db.query("UPDATE users SET refresh_token = $1 WHERE ID = $2", [
    refreshToken,
    userId,
  ]);
};

export const setVerificationOtp = async (userId, otp, expiresAt) => {
  await db.query(
    "UPDATE users SET otp_code = $1,otp_expires = $2 WHERE id = $3",
    [otp, expiresAt, userId],
  );
};

// export const findUserByEmailAndOtp = async (email, otp) => {
//   const result = await db.query(
//     `SELECT * FROM users
//      WHERE email = $1
//      AND otp_code = $2
//      AND otp_expires > NOW()

//     `,
//     [email, otp],
//   );
//   return result.rows[0];
// };

export const findUserByEmailAndOtp = async (email, otp) => {
  console.log("VERIFY EMAIL:", email);
  console.log("VERIFY OTP:", otp);

  const result = await db.query(
    `SELECT * FROM users  
     WHERE email = $1 
     AND otp_code = $2 
     AND otp_expires > NOW()`,
    [email, otp],
  );

  console.log("OTP QUERY RESULT:", result.rows);

  return result.rows[0];
};
export const verifyUserEmail = async (userId) => {
  const response = await db.query(
    `UPDATE users 
    SET is_verified = true,
      otp_code = NULL,
      otp_expires = NULL
   WHERE id = $1
   RETURNING *`,
    [userId],
  );
  return response.rows[0];
};

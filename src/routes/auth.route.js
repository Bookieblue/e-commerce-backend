import express from "express";
import {
  loginUser,
  Logout,
  registerUser,
} from "../controller/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
  *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               gender:
 *                 type: string
 *                 example: male
 *               role:
 *                 type: string
 *                 enum: [customer, vendor, admin]
 *                 example: customer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
  *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User login successfully
 *       409:
 *         description: Email already exists
 
 */
router.post("/login", loginUser);
router.post("/logout", Logout);

export default router;

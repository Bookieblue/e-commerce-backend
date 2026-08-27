import express from "express";
import { loginUser, Logout, registerUser } from "../controller/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */

router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/logout", Logout)


export default router;
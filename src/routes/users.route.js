import express from "express"
import { getUsers, patchUser, getUser } from "../controller/users.controller.js";


const router = express();

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
router.get("/users", getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', patchUser);



export default router;
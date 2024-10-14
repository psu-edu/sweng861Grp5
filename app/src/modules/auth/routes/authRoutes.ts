import { Router } from "express";
import authenticateJWT from "../../../shared/middleware/authenticated.middleware";
import AuthController from "../controllers/authController";
import { validateLogin } from "../validators/authValidator";

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log a user in with valid email and password
 *     tags: [Auth]
 *     description: Logs a user into the app and returns JWT in form of a cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       204:
 *         description: Logged in successfully.
 *       400:
 *         description: Error occurred.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.post("/login", validateLogin, AuthController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Removes jwt cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: logged out.
 *       400:
 *         description: Error occurred.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.post("/logout", authenticateJWT, AuthController.logout);

/**
 * @swagger
 * /verify-token:
 *   get:
 *     summary: Validates JWT token and returns userId
 *     tags: [Auth]
 *     description: Validates JWT token and returns userId
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successful validation.
 *       400:
 *         description: Error occurred.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/verify-token", authenticateJWT, AuthController.validateToken);

export default router;

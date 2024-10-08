import { Router } from "express";
import authenticateJWT from "../../../shared/middleware/authenticated.middleware";
import VitalController from "../controllers/vitalController";

const router = Router();

/**
 * @swagger
 * /vital/token/{vitalUserId}:
 *   get:
 *     summary: Get vital Token for VitalLink
 *     tags: [Vital]
 *     description: Retrieve vital token link for a client to use VitalLink portal.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: vitalUserId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The vitalUserId ID
 *     responses:
 *       200:
 *         description: Token exchanged successfully.
 *       400:
 *         description: Error occurred while fetching goals.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/token/:vitalUserId", authenticateJWT, VitalController.getToken);

export default router;

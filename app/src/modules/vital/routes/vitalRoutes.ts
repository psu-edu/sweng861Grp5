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
router.get("/token/:vitalUserId", VitalController.getToken);

/**
 * @swagger
 * /vital/providers/{vitalUserId}:
 *   get:
 *     summary: Get vital providers for UserId
 *     tags: [Vital]
 *     description: Retrieve vital providers for a client and store info to database.
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
 *         description: Vital Provider retrieved.
 *       400:
 *         description: Error occurred.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/providers/:vitalUserId", VitalController.getProviders);

/**
 * @swagger
 * /vital/{provider}/{vitalUserId}:
 *   get:
 *     summary: Remove vital provider for UserId
 *     tags: [Vital]
 *     description: Remove vital providers for a client and store info to database.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: provider
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The provider name to deregister
 *       - name: vitalUserId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The vitalUserId ID
 *     responses:
 *       200:
 *         description: Provider removed successfully.
 *       400:
 *         description: Error occurred.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/remove/:provider/:vitalUserId", VitalController.getRemovalOfConnection);

export default router;

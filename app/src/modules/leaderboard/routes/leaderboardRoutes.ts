import { Router } from "express";
import authenticateJWT from "../../../shared/middleware/authenticated.middleware";
import LeaderboardController from "../controllers/leaderboardController";
import { validateLeaderboardEntry } from "../validators/leaderboardEntryValidator";

const router = Router();


/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get all leaderboard entries for a team
 *     tags: [Leaderboard]
 *     description: Retrieve all leaderboard entries for a specific team.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/LeaderboardEntry'
 *       404:
 *         description: No leaderboard entries found.
 *       400:
 *         description: Error occurred while fetching leaderboard.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/leaderboard", authenticateJWT, LeaderboardController.getLeaderboard);

/**
 * @swagger
 * /leaderboardEntry/{id}:
 *   get:
 *     summary: Get a specific leaderboard entry
 *     tags: [Leaderboard]
 *     description: Retrieve a leaderboard entry by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the leaderboard entry to retrieve.
 *     responses:
 *       200:
 *         description: Leaderboard entry retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaderboardEntry'
 *       404:
 *         description: Leaderboard entry not found.
 *       400:
 *         description: Error occurred while fetching the leaderboard entry.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/leaderboardEntry/:id", authenticateJWT, LeaderboardController.getLeaderboardEntry);

/**
 * @swagger
 * /leaderboardEntry:
 *   post:
 *     summary: Create a new leaderboard entry
 *     tags: [Leaderboard]
 *     description: Add a new entry to the leaderboard.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeaderboardEntry'
 *     responses:
 *       201:
 *         description: Leaderboard entry created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaderboardEntry'
 *       400:
 *        description: Validation errors or bad request.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.post("/leaderboardEntry", authenticateJWT, validateLeaderboardEntry, LeaderboardController.createLeaderboardEntry);

/**
 * @swagger
 * /leaderboardEntry/{id}:
 *   patch:
 *     summary: Update an existing leaderboard entry
 *     tags: [Leaderboard]
 *     description: Update the details of a specific leaderboard entry by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the leaderboard entry to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLeaderboardEntry'
 *     responses:
 *       200:
 *         description: Leaderboard entry updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaderboardEntry'
 *       404:
 *         description: Leaderboard entry not found.
 *       400:
 *         description: Validation errors or bad request.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.patch("/leaderboardEntry/:id", authenticateJWT, validateLeaderboardEntry, LeaderboardController.updateLeaderboardEntry);

/**
 * @swagger
 * /userEntry/{id}:
 *   delete:
 *     summary: Delete a leaderboard entry
 *     tags: [Leaderboard]
 *     description: Delete a leaderboard entry by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the leaderboard entry to delete.
 *     responses:
 *       200:
 *         description: Leaderboard entry deleted successfully.
 *       404:
 *         description: Leaderboard entry not found.
 *       400:
 *         description: Validation errors or bad request.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.delete("/userEntry/:id", authenticateJWT, LeaderboardController.deleteLeaderboardEntry);

export default router;
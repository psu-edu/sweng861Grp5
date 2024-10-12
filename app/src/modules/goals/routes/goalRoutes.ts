import { Router } from "express";
import authenticateJWT from "../../../shared/middleware/authenticated.middleware";
import GoalController from "../controllers/goalController";
import { validateGoal } from "../validators/goalValidator";

const router = Router();

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals for a team
 *     tags: [Goals]
 *     description: Retrieve all goals for a specific team.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Goals retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Goal'
 *       404:
 *         description: No goals found.
 *       400:
 *         description: Error occurred while fetching goals.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/goals", authenticateJWT, GoalController.getGoals);

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get a goal by ID
 *     tags: [Goals]
 *     description: Retrieve a specific goal by its ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *     responses:
 *       200:
 *         description: Goal found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       404:
 *         description: Goal not found.
 *       400:
 *         description: Invalid Goal ID format.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/goals/:id", authenticateJWT, GoalController.getGoal);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     description: Create a new goal for a team.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       201:
 *         description: Goal created successfully.
 *       400:
 *         description: Validation errors or bad request.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.post("/goals", authenticateJWT, validateGoal, GoalController.createGoal);

/**
 * @swagger
 * /goals/{id}:
 *   patch:
 *     summary: Update a goal
 *     tags: [Goals]
 *     description: Update an existing goal.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       200:
 *         description: Goal updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       404:
 *         description: Goal not found.
 *       400:
 *         description: Invalid Goal ID or validation errors.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.patch(
  "/goals/:id",
  authenticateJWT,
  validateGoal,
  GoalController.updateGoal,
);

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     description: Delete a specific goal by its ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *     responses:
 *       204:
 *         description: Goal deleted successfully.
 *       404:
 *         description: Goal not found.
 *       400:
 *         description: Invalid Goal ID format.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.delete("/goals/:id", authenticateJWT, GoalController.deleteGoal);

export default router;

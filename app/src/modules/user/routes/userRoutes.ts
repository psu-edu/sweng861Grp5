import { Router } from "express";
import authenticateJWT from "../../../shared/middleware/authenticated.middleware";
import UserController from "../controllers/userController";
import { validateUser } from "../validators/userValidator";

const router = Router();

///**
// * @swagger
// * /users:
// *   get:
// *     summary: Get all users for a team
// *     tags: [Users]
// *     description: Retrieve all users for a specific team.
// *     security:
// *       - cookieAuth: []
// *     responses:
// *       200:
// *         description: Users retrieved successfully.
// *         content:
// *           application/json:
// *             schema:
// *               type: array
// *               items:
// *                  $ref: '#/components/schemas/User'
// *       404:
// *         description: No users found.
// *       400:
// *         description: Error occurred while fetching users.
// * @param {Request} req - Express request object
// * @param {Response} res - Express response object
// * @returns {Promise<void>}
// */
//router.get("/users", authenticateJWT, UserController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve a specific user by its ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       400:
 *         description: Invalid User ID format.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.get("/users/:id", authenticateJWT, UserController.getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user for a team.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Validation errors or bad request.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
router.post("/users", validateUser, UserController.createUser);

///**
// * @swagger
// * /users/{id}:
// *   patch:
// *     summary: Update a user
// *     tags: [Users]
// *     description: Update an existing user.
// *     security:
// *       - cookieAuth: []
// *     parameters:
// *       - name: id
// *         in: path
// *         required: true
// *         schema:
// *           type: string
// *         description: The user ID
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             $ref: '#/components/schemas/User'
// *     responses:
// *       200:
// *         description: User updated successfully.
// *         content:
// *           application/json:
// *             schema:
// *               $ref: '#/components/schemas/User'
// *       404:
// *         description: User not found.
// *       400:
// *         description: Invalid User ID or validation errors.
// * @param {Request} req - Express request object
// * @param {Response} res - Express response object
// * @returns {Promise<void>}
// */
//router.patch(
//  "/users/:id",
//  authenticateJWT,
//  validateUser,
//  UserController.updateUser,
//);

///**
// * @swagger
// * /users/{id}:
// *   delete:
// *     summary: Delete a user
// *     tags: [Users]
// *     description: Delete a specific user by its ID.
// *     security:
// *       - cookieAuth: []
// *     parameters:
// *       - name: id
// *         in: path
// *         required: true
// *         schema:
// *           type: string
// *         description: The user ID
// *     responses:
// *       204:
// *         description: User deleted successfully.
// *       404:
// *         description: User not found.
// *       400:
// *         description: Invalid User ID format.
// * @param {Request} req - Express request object
// * @param {Response} res - Express response object
// * @returns {Promise<void>}
// */
//router.delete("/users/:id", authenticateJWT, UserController.deleteUser);

export default router;

import { NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { logger } from "../../../shared/utils/logger";
import UserService from "../service/userService";

class UserController {
	async createUser(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);

		logger.info("Create User request");

		if (!errors.isEmpty()) {
			logger.error(errors.array());
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			logger.info("User signup request received.");
			const user = await UserService.createUser(req.body);

			// Generate JWT
			const token = jwt.sign(
				{ userId: user?._id },
				process.env.JWT_SECRET || "supersecretkey",
				{ expiresIn: "1h" },
			);

			res.cookie("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 3600000, // 1 hour
			});

			res.status(201).json(user);
			logger.info(`User successfully created: ${user?.email}`);
		} catch (error: any) {
			logger.error(`Error creating user: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getUser(req: Request, res: Response): Promise<void> {
		const userId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: "Invalid user ID format" });
			return;
		}

		try {
			logger.info("User get profile request received.");
			const user = await UserService.getUserById(userId);
			if (!user) {
				logger.warn(`User not found with ${req.params.id}`);
				res.status(404).json({ error: "No User Found" });
			} else {
				res.status(201).json(user);
				logger.info(`User successfully retrieved: ${user.email}`);
			}
		} catch (error: any) {
			logger.error(`Error retrieving user: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}
}

export default new UserController();

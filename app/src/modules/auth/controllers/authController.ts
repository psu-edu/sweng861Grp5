import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { logger } from "../../../shared/utils/logger";
import AuthService from "../services/authService";

class AuthController {
	async login(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			logger.info("Login request received.");
			const { email, password } = req.body;
			const user = await AuthService.verifyUserCredentials(email, password);

			if (!user) {
				res.status(401).json({ error: "Invalid credentials" });
				return;
			}

			// Generate JWT
			const token = jwt.sign(
				{ userId: user._id },
				process.env.JWT_SECRET || "supersecretkey",
				{ expiresIn: "1h" },
			);

			res.cookie("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 3600000, // 1 hour
			});

			logger.debug(`Setting cookie with token: ${token}`);

			const headers = res.getHeaders();
			logger.debug(`Response headers: ${JSON.stringify(headers, null, 2)}`);

			res.status(204).json();
			logger.info("Loggin Successful");
		} catch (error: any) {
			logger.error(`Error creating Logging In: ${error.message} `);
			res.status(400).json({ error: error.message });
		}
	}

	async logout(req: Request, res: Response): Promise<void> {
		logger.info("Logout request recieved");
		res.clearCookie("jwt");
		res.status(204).json();
		logger.info("Logout request successful");
	}

	async validateToken(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		res.status(200).json({ userId: req.userId });
	}
}

export default new AuthController();

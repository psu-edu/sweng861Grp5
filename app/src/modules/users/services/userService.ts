import { logger } from "../../../shared/utils/logger";
import type { IUser } from "../models/user";
import UserRepository from "../repositories/userRepository";

class UserService {
	async createUser(userData: Partial<IUser>): Promise<IUser> {
		const email = userData.email ? userData.email : "";
		const existingUser = await UserRepository.findByEmail(email);
		if (existingUser) {
			logger.warn(
				`Attempt to create user with existing email: ${userData.email}`,
			);
			throw new Error("Email already in use.");
		}

		logger.info(`Creating new user: ${userData.email}`);
		return await UserRepository.create(userData);
	}

	async authenticateUser(
		email: string,
		password: string,
	): Promise<IUser | null> {
		const user = await UserRepository.findByEmail(email);
		if (!user) {
			logger.warn(`Login failed for non-existent email: ${email}`);
			return null;
		}

		const isMatch = await user.comparePassword(password);
		if (isMatch) {
			logger.info(`User authenticated: ${email}`);
			return user;
		}
		logger.warn(`Invalid password attempt for email: ${email}`);
		return null;
	}

	async getUserById(id: string): Promise<IUser | null> {
		logger.info(`Retrieving user: ${id}`);
		return await UserRepository.findById(id);
	}
}

export default new UserService();

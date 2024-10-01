import { logger } from "../../../shared/utils/logger";
import User, { type IUser } from "../models/user";

class UserRepository {
	async create(userData: Partial<IUser>): Promise<IUser> {
		try {
			const user = new User(userData);
			const savedUser = await user.save();
			logger.info(`User created: ${savedUser.email}`);
			return savedUser;
		} catch (error: any) {
			logger.error(`Error creating user: ${userData.email} - ${error.message}`);
			throw error;
		}
	}

	async findByEmail(email: string): Promise<IUser | null> {
		try {
			const user = await User.findOne({ email });
			if (user) {
				logger.info(`User found by email: ${email}`);
			} else {
				logger.warn(`No user found for email: ${email}`);
			}
			return user;
		} catch (error: any) {
			logger.error(`Error finding user by email: ${email} - ${error.message}`);
			throw error;
		}
	}

	async findById(id: string): Promise<IUser | null> {
		try {
			const user = await User.findOne({ _id: id });
			if (user) {
				logger.info(`User found by id: ${id}`);
			} else {
				logger.warn(`No user found for id: ${id}`);
			}
			return user;
		} catch (error: any) {
			logger.error(`Error finding user by id: ${id} - ${error.message}`);
			throw error;
		}
	}
}

export default new UserRepository();

import mongoose from "mongoose";
import { logger } from "../../../shared/utils/logger";
import User, { type IUser } from "../model/user";

class UserRepository {
	async create(userData: Partial<IUser>): Promise<IUser> {
		const data = {
			...userData,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		try {
			const user = new User(data);
			const savedUser = await user.save();
			logger.info(`User created: ${savedUser.username}`);
			return savedUser;
		} catch (error: any) {
			logger.error(
				`Error creating user: ${userData.username} - ${error.message}`,
			);
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

	async findByVitalId(id: string): Promise<IUser | null> {
		try {
			const user = await User.findOne({ vitalUserId: id });
			if (user) {
				logger.info(`User found by vitalId: ${id}`);
			} else {
				logger.warn(`No user found for vitalId: ${id}`);
			}
			return user;
		} catch (error: any) {
			logger.error(`Error finding user by vitalId: ${id} - ${error.message}`);
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

	async deleteUser(id: string): Promise<boolean | null> {
		try {
			const user = await User.deleteOne({ _id: id });
			if (user) {
				logger.info(`User found and deleted by id: ${id}`);
			} else {
				logger.warn(`No user found for id: ${id}`);
			}
			if (!user) return false;
			return true;
		} catch (error: any) {
			logger.error(
				`Error finding and deleting user by id: ${id} - ${error.message}`,
			);
			throw error;
		}
	}

	async updateUser(
		id: string,
		updateData: Partial<IUser>,
	): Promise<IUser | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error("Invalid user ID");
		}

		const data = {
			...updateData,
			updatedAt: Date.now(),
		};

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true },
		);

		return updatedUser;
	}
}

export default new UserRepository();

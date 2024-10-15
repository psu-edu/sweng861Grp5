import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { QueueMessage } from "../../../shared/utils/types";
import type { IUser } from "../model/user";
import UserRepository from "../repository/userRepository";

class UserService {
	async createUser(userData: Partial<IUser>): Promise<IUser | null> {
		const existingUser = await UserRepository.findByEmail(userData.email!);
		if (existingUser) {
			logger.warn(
				`Attempt to create user with existing email: ${userData.email}`,
			);
			logger.error("Email already in use.");
			return null;
		}

		const user = await UserRepository.create(userData);

		logger.info(`Created new user id: ${user._id} and name: ${user.username}`);

		const data = {
			...user,
			userId: user._id,
		};

		try {
			const message: QueueMessage = {
				event: EVENTS.USER_CREATED,
				data,
			};

			await mqConnection.sendToQueue(QUEUES.USER_CREATED, message);
		} catch (error) {
			logger.error(error);
		}

		return user;
	}

	async getUserById(id: string): Promise<IUser | null> {
		logger.info(`Retrieving user: ${id}`);
		return await UserRepository.findById(id);
	}
}

export default new UserService();

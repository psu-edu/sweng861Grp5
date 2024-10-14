import cacheService from "../../../shared/utils/cacheService";
import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { QueueMessage } from "../../../shared/utils/types";
import type { IUser } from "../../user/model/user";
import userRepository from "../../user/repository/userRepository";

class AuthService {
	async verifyUserCredentials(
		email: string,
		password: string,
	): Promise<IUser | null> {
		const user = await userRepository.findByEmail(email);

		if (!user) {
			logger.warn(`Login failed for non-existent email: ${email}`);
			return null;
		}

		logger.debug(`Found user ${JSON.stringify(user)}`);

		const isMatch = await user.comparePassword(password);

		if (isMatch) {
			logger.info(`User authenticated: ${email}`);

			const data = {
				...user,
			};

			const message: QueueMessage = {
				event: EVENTS.LOGIN,
				data,
			};

			mqConnection.sendToQueue(QUEUES.USER, message);

			return user;
		}
		logger.warn(`Invalid password attempt for email: ${email}`);
		return null;
	}
}

export default new AuthService();

import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { QueueMessage } from "../../../shared/utils/types";
import type { IUser } from "../model/user";
import UserRepository from "../repository/userRepository";

class AsyncUserService {
	constructor() {
		mqConnection.consume(this.handleEvent.bind(this), QUEUES.VITAL_USER);
	}

	private async handleEvent(event: { event: string; data: any }) {
		if (event.event === EVENTS.VITAL_USER) {
			const { userId, vitalUserId } = event.data;

			logger.info(
				`Updating user with a vitalId, userId: ${userId} and client userId: ${vitalUserId}`,
			);

			let user = await UserRepository.findById(userId);

			user = user?.toObject();

			logger.debug(`User found: ${user}`);

			const updatedUser = {
				...user,
				vitalUserId,
			};

			logger.debug(`New user update: ${updatedUser}`);

			try {
				const data: IUser | null = await UserRepository.updateUser(
					userId,
					updatedUser,
				);

				const message: QueueMessage = {
					event: EVENTS.USER_UPDATED,
					data: data as {},
				};

				logger.info(`Updated User with ${JSON.stringify(updatedUser)}`);

				mqConnection.sendToQueue(QUEUES.USER, message);
			} catch (error) {
				logger.error(error);
			}
		}

		if (event.event === EVENTS.VITAL_PROVIDER) {
			const { providers, vitalUserId } = event.data;

			let user: IUser | null = await UserRepository.findByVitalId(vitalUserId);

			logger.info(`Updating user: ${user?.username}`);

			user = user?.toObject();

			const updatedUser = {
				...user,
				providers,
			};

			try {
				const data: IUser | null = await UserRepository.updateUser(
					user?._id as string,
					updatedUser,
				);

				const message: QueueMessage = {
					event: EVENTS.USER_UPDATED,
					data: data as {},
				};

				mqConnection.sendToQueue(QUEUES.USER, message);
			} catch (error) {
				logger.error(error);
			}
		}
	}
}

export default new AsyncUserService();

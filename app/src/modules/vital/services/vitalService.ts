import * as crypto from "node:crypto";
import { VitalClient, VitalEnvironment } from "@tryvital/vital-node";
import type { UserCreateBody } from "@tryvital/vital-node/api";
import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { generateRandomBytes } from "../../../shared/utils/generateRandomBytes";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { QueueMessage } from "../../../shared/utils/types";

type VitalUserResponse = {
	userId: string;
	clientUserId: string;
};

class VitalService {
	constructor() {
		mqConnection.consume(this.handleEvent.bind(this), QUEUES.USER_CREATED);
	}

	private async handleEvent(event: { event: string; data: any }) {
		if (event.event === EVENTS.USER_CREATED) {
			const { userId } = event.data;

			const saltyUser = this.saltUserId(userId);
			logger.info(
				`Creating new vital user with userId: ${userId} and client userId: ${saltyUser}`,
			);
			const client = new VitalClient({
				apiKey: process.env.VITAL_API_KEY,
				environment: VitalEnvironment.Sandbox,
			});

			const request: UserCreateBody = {
				clientUserId: saltyUser,
			};

			try {
				const vitalData: VitalUserResponse = await client.user.create(request);

				const data = {
					clientUserId: vitalData.clientUserId,
					vitalUserId: vitalData.userId,
					userId,
				};

				const message: QueueMessage = {
					event: EVENTS.VITAL_USER,
					data,
				};

				mqConnection.sendToQueue(QUEUES.VITAL_USER, message);
			} catch (error) {
				logger.error(error);
			}
		}
	}

	private saltUserId(userId: string): string {
		const salt = generateRandomBytes(16);
		return crypto
			.createHash("sha256")
			.update(userId + salt)
			.digest("hex");
	}
}

export default new VitalService();

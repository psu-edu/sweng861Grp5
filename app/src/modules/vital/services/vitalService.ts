import * as crypto from "node:crypto";
import { VitalClient, VitalEnvironment } from "@tryvital/vital-node";
import type { UserCreateBody } from "@tryvital/vital-node/api";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";

type VitalUserResponse = {
	userId: string;
	clientUserId: string;
};

class VitalService {
	constructor() {
		mqConnection.consume(this.handleEvent.bind(this), "user_event");
	}

	private async handleEvent(event: { event: string; data: any }) {
		if (event.event === "user_created") {
			const { userId } = event.data;

			const saltyUser = this._saltUserId(userId);
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
				const data: VitalUserResponse = await client.user.create(request);

				const message = {
					event: "VitalUserCreated",
					data: data,
				};

				mqConnection.sendToQueue("vital-user-queue", message);
			} catch (error) {
				logger.error(error);
			}
		}
	}

	_saltUserId(userId: string): string {
		const salt = crypto.randomBytes(16).toString("hex");
		return crypto
			.createHash("sha256")
			.update(userId + salt)
			.digest("hex");
	}
}

export default new VitalService();

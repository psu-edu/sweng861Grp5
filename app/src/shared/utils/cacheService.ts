import { logger } from "./logger";
import mqConnection from "./rabbitmq";
import Cache from "./redis";

class CacheService {
	constructor() {
		// Bind the handleEvent method to ensure 'this' refers to the CacheService instance
		mqConnection.consume(this.handleEvent.bind(this), "user_event");
	}

	private async handleEvent(event: { event: string; data: any }) {
		if (
			event.event === "user_logged_in" ||
			event.event === "user_team_changed"
		) {
			const { userId, teamId } = event.data;
			const redis = Cache.getInstance();
			await redis.set(`user:${userId}:teamId`, teamId, 60 * 60 * 24); // Cache for 24 hours
			logger.info(`Cached teamId for user ${userId}`);
		}
	}

	async getTeamIdFromCache(userId: string): Promise<string | null> {
		const redis = Cache.getInstance();
		return await redis.get(`user:${userId}:teamId`);
	}
}

export default new CacheService();

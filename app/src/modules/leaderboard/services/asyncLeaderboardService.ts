import cacheService from "../../../shared/utils/cacheService";
import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import LeaderboardRepository from "../repositories/leaderboardRepository";

class AsyncLeaderboardService {
	constructor() {
		mqConnection.consume(this.handleEvent.bind(this), QUEUES.GOALS);
	}

	private async handleEvent(event: { event: string; data: any }) {
		if (event.event === EVENTS.GOAL_CREATED) {
			const { userId, name, _id, teamId } = event.data;

			// const teamId = await cacheService.getTeamIdFromCache(userId);
			// TODO fake for demo
			logger.info(`Creating new user entry in leaderboard: ${name}`);

			logger.debug(`${JSON.stringify(event.data)}`);

			const data = {
				goalId: _id,
				name,
				createdAt: new Date(),
				userId,
				teamId,
			};

			let leaderboard = await LeaderboardRepository.create(data, teamId);

			leaderboard = leaderboard?.toObject();

			try {
				const message = {
					event: "LeaderboardEntryCreated",
					data: leaderboard,
				};

				mqConnection.sendToQueue(`team-${teamId}-leaderboard-queue`, message);
			} catch (error) {
				logger.error(error);
			}
		}
	}
}

export default new AsyncLeaderboardService();

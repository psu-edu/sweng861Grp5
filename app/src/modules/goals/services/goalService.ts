import cacheService from "../../../shared/utils/cacheService";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { IGoal } from "../models/goal";
import GoalRepository from "../repositories/goalRepository";

class GoalService {
	async createGoal(goalData: Partial<IGoal>): Promise<IGoal> {
		logger.info(
			`Creating new goal: ${goalData.name} with teamId: ${goalData.teamId}`,
		);

		const message = {
			action: "GoalCreated",
			goal: goalData,
		};

		mqConnection.sendToQueue(`team-${goalData.teamId}-goal-queue`, message);

		return await GoalRepository.create(goalData);
	}

	async getGoalById(id: string): Promise<IGoal | null> {
		logger.info(`Retrieving goal: ${id}`);
		const teamId = await cacheService.getTeamIdFromCache(id);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return await GoalRepository.findById(id, teamId!);
	}

	async getGoals(teamId: string): Promise<IGoal[] | null> {
		logger.info("Retrieving goals");
		return await GoalRepository.findAll(teamId);
	}

	async updateGoalById(
		id: string,
		data: Partial<IGoal>,
	): Promise<IGoal | null> {
		logger.info(`Updating goal: ${id}`);

		const message = {
			action: "GoalUpdated",
			goal: data,
		};

		mqConnection.sendToQueue(`team-${data.teamId}-goal-queue`, message);

		return await GoalRepository.updateById(id, data);
	}

	async deleteGoalById(id: string): Promise<boolean | null> {
		logger.info(`Deleting goal: ${id}`);

		const teamId = await cacheService.getTeamIdFromCache(id);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const goalData = await GoalRepository.findById(id, teamId!);

		const message = {
			action: "GoalDeleted",
			goal: goalData,
		};

		mqConnection.sendToQueue(`team-${goalData?.teamId}-goal-queue`, message);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return await GoalRepository.deleteById(id, teamId!);
	}
}

export default new GoalService();

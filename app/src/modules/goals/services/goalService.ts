import cacheService from "../../../shared/utils/cacheService";
import { EVENTS, QUEUES } from "../../../shared/utils/enums";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";
import type { QueueMessage } from "../../../shared/utils/types";
import type { IGoal } from "../models/goal";
import GoalRepository from "../repositories/goalRepository";

class GoalService {
	async createGoal(goalData: Partial<IGoal>, userId: string): Promise<IGoal> {
		// const teamId = await cacheService.getTeamIdFromCache(userId);
		// TODO temp for the demo
		const teamId = "123";
		logger.info(`Creating new goal: ${goalData.name} with teamId: ${teamId}`);

		const data = {
			...goalData,
			createdAt: new Date(),
			userId,
			teamId: teamId!,
		};

		let goal = await GoalRepository.create(data, teamId!);

		goal = goal.toObject();

		const message: QueueMessage = {
			event: EVENTS.GOAL_CREATED,
			data: goal,
		};

		// TODO figure out tenet queues
		mqConnection.sendToQueue(QUEUES.GOALS, message);

		return goal;
	}

	async getGoalById(id: string, userId: string): Promise<IGoal | null> {
		logger.info(`Retrieving goal: ${id}`);
		const teamId = await cacheService.getTeamIdFromCache(userId);
		return await GoalRepository.findById(id, teamId!);
	}

	async getGoals(userId: string): Promise<IGoal[] | null> {
		const teamId = await cacheService.getTeamIdFromCache(userId);

		logger.info("Retrieving goals");
		return await GoalRepository.findAll(teamId!);
	}

	async updateGoalById(
		id: string,
		userId: string,
		data: Partial<IGoal>,
	): Promise<IGoal | null> {
		logger.info(`Updating goal: ${id}`);

		const teamId = await cacheService.getTeamIdFromCache(userId);

		const goalData = {
			...data,
			updatedAt: new Date(),
			userId,
			teamId: teamId!,
		};

		const message: QueueMessage = {
			event: EVENTS.GOAL_UPDATED,
			data: goalData,
		};

		mqConnection.sendToQueue(`team-${teamId!}-goal-queue`, message);

		return await GoalRepository.updateById(id, teamId!, goalData);
	}

	async deleteGoalById(id: string, userId: string): Promise<boolean | null> {
		logger.info(`Deleting goal: ${id}`);

		const teamId = await cacheService.getTeamIdFromCache(userId);
		const goalData = await GoalRepository.findById(id, teamId!);

		const message: QueueMessage = {
			event: EVENTS.GOAL_DELETED,
			data: goalData as {},
		};

		mqConnection.sendToQueue(`team-${teamId}-goal-queue`, message);
		return await GoalRepository.deleteById(id, teamId!);
	}
}

export default new GoalService();

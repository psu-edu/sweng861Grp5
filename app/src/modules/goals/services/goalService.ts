import { logger } from "../../../shared/utils/logger";
import type { IGoal } from "../models/goal";
import GoalRepository from "../repositories/goalRepository";

class GoalService {
  async createGoal(goalData: Partial<IGoal>): Promise<IGoal> {
    logger.info(`Creating new goal: ${goalData.email}`);
    return await GoalRepository.create(goalData);
  }

  async getGoalById(id: string): Promise<IGoal | null> {
    logger.info(`Retrieving goal: ${id}`);
    return await GoalRepository.findById(id);
  }

  async getGoals(): Promise<IGoal[] | null> {
    logger.info(`Retrieving goals`);
    return await GoalRepository.findAll();
  }

  async updateGoalById(
    id: string,
    data: Partial<IGoal>,
  ): Promise<IGoal | null> {
    logger.info(`Updating goal: ${id}`);
    return await GoalRepository.updateById(id, data);
  }

  async deleteGoalById(id: string): Promise<boolean | null> {
    logger.info(`Deleting goal: ${id}`);
    return await GoalRepository.deleteById(id);
  }
}

export default new GoalService();

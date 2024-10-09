import { logger } from "../../../shared/utils/logger";
import Goal, { type IGoal } from "../models/goal";

class GoalRepository {
	async create(goalData: Partial<IGoal>, teamId: string): Promise<IGoal> {
		const data = {
			...goalData,
			teamId,
		};
		try {
			const goal = new Goal(data);
			const savedGoal = await goal.save();
			logger.info(`Goal created: ${savedGoal.name}`);
			return savedGoal;
		} catch (error: any) {
			logger.error(`Error creating goal: ${goalData.name} - ${error.message}`);
			throw error;
		}
	}

	async findById(id: string, teamId: string): Promise<IGoal | null> {
		try {
			const goal = await Goal.findOne({ _id: id, teamId });
			if (goal) {
				logger.info(`Goal found by id: ${id}`);
			} else {
				logger.warn(`No goal found for id: ${id}`);
			}
			return goal;
		} catch (error: any) {
			logger.error(`Error finding goal by id: ${id} - ${error.message}`);
			throw error;
		}
	}

	async findAll(teamId: string): Promise<IGoal[] | null> {
		try {
			const goal = await Goal.find({ teamId });
			if (goal) {
				logger.info("Goals found");
			} else {
				logger.warn("No goals found");
			}
			return goal;
		} catch (error: any) {
			logger.error(`Error finding goals: - ${error.message}`);
			throw error;
		}
	}

	async updateById(
		id: string,
		teamId: string,
		updateData: Partial<IGoal>,
	): Promise<IGoal | null> {
		try {
			const goal = await Goal.findByIdAndUpdate(
				{ _id: id, teamId },
				{ $set: updateData },
				{ new: true },
			);
			if (goal) {
				logger.info(`Goal updated with id: ${id}`);
			} else {
				logger.warn(`No goal found for id: ${id}`);
			}
			return goal;
		} catch (error: any) {
			logger.error(`Error updating goal by id: ${id} - ${error.message}`);
			throw error;
		}
	}

	async deleteById(id: string, teamId: string): Promise<boolean | null> {
		try {
			const goal = await Goal.deleteOne({ _id: id, teamId });
			if (goal.deletedCount > 0) {
				logger.info("Goal deleted");
			} else {
				logger.warn(`No goal found for id: ${id}`);
			}
			return goal.deletedCount > 0;
		} catch (error: any) {
			logger.error(`Error deleting goal by id: ${id} - ${error.message}`);
			throw error;
		}
	}
}

export default new GoalRepository();

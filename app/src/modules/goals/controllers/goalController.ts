import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { logger } from "../../../shared/utils/logger";
import type { IGoal } from "../models/goal";
import GoalService from "../services/goalService";

class GoalController {
	async createGoal(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}
		try {
			logger.info("Goal signup request received.");
			const goal: IGoal = await GoalService.createGoal(req.body);
			res.status(201).json(goal);
			logger.info(`Goal successfully created: ${goal.name}`);
		} catch (error: any) {
			logger.error(`Error creating Goal: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getGoal(req: Request, res: Response): Promise<void> {
		const goalId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(goalId)) {
			res.status(400).json({ message: "Invalid Goal ID format" });
		}

		try {
			logger.info("Goal get profile request received.");
			const goal = await GoalService.getGoalById(goalId);
			if (!goal) {
				logger.warn(`Goal not found with ${req.params.id}`);
				res.status(404).json({ error: "No Goal Found" });
			} else {
				res.status(200).json(goal);
				logger.info(`Goal successfully retrieved: ${goal.name}`);
			}
		} catch (error: any) {
			logger.error(`Error retrieving Goal: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getGoals(req: Request, res: Response): Promise<void> {
		const teamId = req.params.teamId;
		try {
			logger.info("Goals get request received.");
			const goals = await GoalService.getGoals(teamId);
			if (!goals) {
				logger.warn("No goals found");
				res.status(404).json({ error: "No Goals Found" });
			} else {
				res.status(200).json(goals);
				logger.info("Goals successfully retrieved");
			}
		} catch (error: any) {
			logger.error(`Error retrieving Goals: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async updateGoal(req: Request, res: Response): Promise<void> {
		const goalId = req.params.id;
		const goalData = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		if (!mongoose.Types.ObjectId.isValid(goalId)) {
			res.status(400).json({ message: "Invalid Goal ID format" });
		}

		try {
			logger.info("Goal update request received.");
			const goal = await GoalService.updateGoalById(goalId, goalData);
			if (!goal) {
				logger.warn(`Goal not found with ${req.params.id}`);
				res.status(404).json({ error: "No Goal Found" });
			} else {
				res.status(200).json(goal);
				logger.info(`Goal successfully updated: ${goal.name}`);
			}
		} catch (error: any) {
			logger.error(`Error updating Goal: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async deleteGoal(req: Request, res: Response): Promise<void> {
		const goalId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(goalId)) {
			res.status(400).json({ message: "Invalid Goal ID format" });
		}

		try {
			logger.info("Goal delete request received.");
			const goal = await GoalService.deleteGoalById(goalId);
			if (!goal) {
				logger.warn(`Goal not found with ${req.params.id}`);
				res.status(404).json({ error: "No Goal Found" });
			} else {
				res.status(203).json();
				logger.info("Goal successfully deleted");
			}
		} catch (error: any) {
			logger.error(`Error deleting Goal: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}
}

export default new GoalController();

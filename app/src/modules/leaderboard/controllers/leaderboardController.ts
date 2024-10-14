import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { logger } from "../../../shared/utils/logger";
import type { ILeaderboardEntry } from "../models/leaderboardEntry";
import LeaderboardService from "../services/leaderboardService";

class LeaderboardController {
	async createLeaderboardEntry(req: Request, res: Response): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		try {
			logger.info("New Leaderboard Entry request received.");
			const leaderboardEntry: ILeaderboardEntry =
				await LeaderboardService.createLeaderboardEntry(req.body, req.userId!);
			res.status(201).json(leaderboardEntry);
			logger.info(
				`Leaderboard Entry successfully created: ${leaderboardEntry.name}`,
			);
		} catch (error: any) {
			logger.error(`Error creating Leaderboard Entry: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getLeaderboardEntry(req: Request, res: Response): Promise<void> {
		const userEntryId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(userEntryId)) {
			res.status(400).json({ message: "Invalid Leaderboard Entry ID format" });
		}

		try {
			logger.info("Leaderboard Entry get request received.");
			const leaderboardEntry = await LeaderboardService.getLeaderboardEntryById(
				userEntryId,
				req.userId!,
			);
			if (!leaderboardEntry) {
				logger.warn(`Leaderboard Entry not found with ${req.params.id}`);
				res.status(404).json({ error: "No Leaderboard Entries Found" });
			} else {
				res.status(200).json(leaderboardEntry);
				logger.info(
					`Leaderboard Entry successfully retrieved: ${leaderboardEntry.name}`,
				);
			}
		} catch (error: any) {
			logger.error(`Error retrieving Leaderboard Entry: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getLeaderboard(req: Request, res: Response): Promise<void> {
		try {
			logger.info("Leaderboard get request received.");
			const leaderboardEntries = await LeaderboardService.getAllLeaderboard(
				req.userId!,
			);
			if (!leaderboardEntries) {
				logger.warn("No leaderboard entries found in leaderboard");
				res.status(404).json({ error: "No User Entries Found" });
			} else {
				res.status(200).json(leaderboardEntries);
				logger.info("Leaderboard Entries Successfully Retrieved");
			}
		} catch (error: any) {
			logger.error(`Error retrieving Leaderboard Entries: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async updateLeaderboardEntry(req: Request, res: Response): Promise<void> {
		const leaderboardEntryId = req.params.id;
		const leaderboardEntryData = req.body;

		if (!mongoose.Types.ObjectId.isValid(leaderboardEntryId)) {
			res.status(400).json({ message: "Invalid leaderboard Entry ID format" });
		}

		try {
			logger.info("Leaderboard Entry for leaderboard update request received.");
			const leaderboardEntry = await LeaderboardService.updateLeaderboardEntry(
				leaderboardEntryId,
				req.userId!,
				leaderboardEntryData,
			);
			if (!leaderboardEntry) {
				logger.warn(`Leaderboard Entry not found with ${req.params.id}`);
				res
					.status(404)
					.json({ error: "No Leaderboard Entry Found in Leaderboard" });
			} else {
				res.status(200).json(leaderboardEntry);
				logger.info(
					`Leaderboard Entry successfully updated in Leaderboard: ${leaderboardEntry.name}`,
				);
			}
		} catch (error: any) {
			logger.error(`Error updating Leaderboard Entry: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async deleteLeaderboardEntry(req: Request, res: Response): Promise<void> {
		const leaderboardEntryId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(leaderboardEntryId)) {
			res.status(400).json({ message: "Invalid Leaderboard Entry ID format" });
		}

		try {
			logger.info("Leaderboard Entry delete request received.");
			const userEntry = await LeaderboardService.deleteLeaderboardEntry(
				leaderboardEntryId,
				req.userId!,
			);
			if (!userEntry) {
				logger.warn(`Leaderboard Entry not found with ${req.params.id}`);
				res.status(404).json({ error: "No Leaderboard Entry Found" });
			} else {
				res.status(204).json();
				logger.info("Leaderboard Entry successfully deleted from Leaderboard");
			}
		} catch (error: any) {
			logger.error(
				`Error deleting Leaderboard Entry from Leaderboard: ${error.message}`,
			);
			res.status(400).json({ error: error.message });
		}
	}
}

export default new LeaderboardController();

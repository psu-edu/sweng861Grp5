import type { Request, Response } from "express";
import mongoose from "mongoose";
import { logger } from "../../../shared/utils/logger";
import type { IUserEntry } from "../models/userEntry";
import LeaderboardService from "../services/leaderboardService";

class LeaderboardController {
    constructor(private leaderboardService: LeaderboardService) { }

    async getAllLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            logger.info("Leaderboard get request received.");
            const userEntries = await this.leaderboardService.getAllLeaderboard();
            if (!userEntries) {
                logger.warn(`No user entries found in leaderboard`);
                res.status(404).json({ error: "No User Entries Found" });
            } else {
                res.status(200).json(userEntries);
                logger.info(`Leaderboard User Entries Successfully Retrieved`);
            }
        } catch (error: any) {
            logger.error(`Error retrieving User Entries: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async getLeaderboardEntry(req: Request, res: Response): Promise<void> {
        const userEntryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userEntryId)) {
            res.status(400).json({ message: "Invalid User Entry ID format" });
        }

        try {
            logger.info("Leaderboard User Entry get request received.");
            const userEntry = await this.leaderboardService.getLeaderboardUserEntryById(userEntryId);
            if (!userEntry) {
                logger.warn(`User Entry not found with ${req.params.id}`);
                res.status(404).json({ error: "No User Entry Found in Leaderboard" });
            } else {
                res.status(200).json(userEntry);
                logger.info(`Goal successfully retrieved: ${userEntry.name}`);
            }
        } catch (error: any) {
            logger.error(`Error retrieving user Entry: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async createLeaderboardEntry(req: Request, res: Response): Promise<void> {
        try {
            logger.info("New User Entry request received.");
            const userEntry: IUserEntry = await this.leaderboardService.createLeaderboardEntry(req.body);
            res.status(201).json(userEntry);
            logger.info(`User Entry successfully created: ${userEntry.name}`);
        } catch (error: any) {
            logger.error(`Error creating User Entry: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async updateLeaderboardEntry(req: Request, res: Response): Promise<void> {
        const userEntryId = req.params.id;
        const userEntryData = req.body;

        if (!mongoose.Types.ObjectId.isValid(userEntryId)) {
            res.status(400).json({ message: "Invalid user Entry ID format" });
        }

        try {
            logger.info("User Entry for leaderboard update request received.");
            const userEntry = await this.leaderboardService.updateLeaderboardEntry(userEntryId, userEntryData);
            if (!userEntry) {
                logger.warn(`User Entry not found with ${req.params.id}`);
                res.status(404).json({ error: "No User Entry Found in Leaderboard" });
            } else {
                res.status(200).json(userEntry);
                logger.info(`User Entry successfully updated in Leaderboard: ${userEntry.name}`);
            }
        } catch (error: any) {
            logger.error(`Error updating User Entry: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteLeaderboardEntry(req: Request, res: Response): Promise<void> {
        const userEntryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userEntryId)) {
            res.status(400).json({ message: "Invalid User Entry ID format" });
        }

        try {
            logger.info("User Entry delete request received.");
            const userEntry = await this.leaderboardService.deleteLeaderboardEntry(userEntryId);
            if (!userEntry) {
                logger.warn(`User Entry not found with ${req.params.id}`);
                res.status(404).json({ error: "No User Entry Found" });
            } else {
                res.status(203).json();
                logger.info(`User Entry successfully deleted from Leaderboard`);
            }
        } catch (error: any) {
            logger.error(`Error deleting User Entry from Leaderboard: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }
}

export default LeaderboardController;
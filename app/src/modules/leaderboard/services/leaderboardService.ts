import { logger } from "../../../shared/utils/logger";
import type { IUserEntry } from "../models/userEntry";
import LeaderboardRepository from "../repositories/leaderboardRepository";
import { Connection } from "mongoose";

class LeaderboardService {
    private leaderboardRepository: LeaderboardRepository;

    constructor(connection: Connection) {
        // Pass the connection to the repository
        this.leaderboardRepository = new LeaderboardRepository(connection);
    }

    async getAllLeaderboard(): Promise<IUserEntry[] | null> {
        logger.info(`Retriving user entries`);
        return await this.leaderboardRepository.findAll();
    }

    async getLeaderboardUserEntryById(id: string): Promise<IUserEntry | null> {
        logger.info(`Retrieving user entry: ${id} in leaderboard`);
        return await this.leaderboardRepository.findById(id);
    }

    async createLeaderboardEntry(entryData: Partial<IUserEntry>): Promise<IUserEntry> {
        logger.info(`Creating new user entry in leaderboard: ${entryData.name}`);
        return await this.leaderboardRepository.create(entryData);
    }

    async updateLeaderboardEntry(id: string, data: Partial<IUserEntry>): Promise<IUserEntry | null> {
        logger.info(`Updating user entry data in leaderboard: ${id}`);
        return await this.leaderboardRepository.updateById(id, data);
    }

    async deleteLeaderboardEntry(id: string): Promise<boolean | null> {
        logger.info(`Deleting user entry in leaderboard: ${id}`);
        return await this.leaderboardRepository.deleteById(id);
    }
}
export default LeaderboardService;
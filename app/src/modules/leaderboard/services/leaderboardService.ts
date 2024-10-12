import cacheService from "../../../shared/utils/cacheService";
import { logger } from "../../../shared/utils/logger";
import type { ILeaderboardEntry } from "../models/leaderboardEntry";
import mqConnection from "../../../shared/utils/rabbitmq";
import LeaderboardRepository from "../repositories/leaderboardRepository";

class LeaderboardService {

    async createLeaderboardEntry(leaderboardEntryData: Partial<ILeaderboardEntry>, userId: string ): Promise<ILeaderboardEntry> {
        const teamId = await cacheService.getTeamIdFromCache(userId);
        logger.info(`Creating new user entry in leaderboard: ${leaderboardEntryData.name}`);

        const data = {
            ...leaderboardEntryData,
            createdAt: new Date(),
            userId,
            teamId: teamId!,
        };

        const message = {
            event: "LeaderboardEntryCreated",
            data: data,
        };

        mqConnection.sendToQueue(`team-${teamId}-leaderboard-queue`, message);

        return await LeaderboardRepository.create(leaderboardEntryData, teamId!);
    }

    async getLeaderboardEntryById(id: string, userId: string): Promise<ILeaderboardEntry | null> {
        logger.info(`Retrieving leaderboard entry: ${id} in leaderboard`);
        const teamId = await cacheService.getTeamIdFromCache(userId);
        return await LeaderboardRepository.findById(id, teamId!);
    }


    async getAllLeaderboard(userId: string): Promise<ILeaderboardEntry[] | null> {
        logger.info(`Retrieving user entries`);
        const teamId = await cacheService.getTeamIdFromCache(userId);
        return await LeaderboardRepository.findAll(teamId!);
    }

  
    async updateLeaderboardEntry(id: string, userId: string, data: Partial<ILeaderboardEntry>): Promise<ILeaderboardEntry | null> {
        logger.info(`Updating user entry data in leaderboard: ${id}`);
        const teamId = await cacheService.getTeamIdFromCache(userId);

        const leaderboardEntryData = {
            ...data,
            updatedAt: new Date(),
            userId,
            teamId: teamId!,
        };

        const message = {
            event: "LeaderboardUpdated",
            data: leaderboardEntryData,
        };

        mqConnection.sendToQueue(`team-${teamId}-leaderboard-queue`, message);
        return await LeaderboardRepository.updateById(id, teamId!, leaderboardEntryData);
    }

    async deleteLeaderboardEntry(id: string, userId: string): Promise<boolean | null> {
        logger.info(`Deleting user entry in leaderboard: ${id}`);

        const teamId = await cacheService.getTeamIdFromCache(userId);
        const leaderEntryData = await LeaderboardRepository.findById(id, teamId!);

        const message = {
            event: "LeaderboardEntryDeleted",
            data: LeaderboardRepository,
        };

        mqConnection.sendToQueue(`team-${teamId}-leaderboard-queue`, message);

        return await LeaderboardRepository.deleteById(id, teamId!);
    }
}
export default new LeaderboardService();
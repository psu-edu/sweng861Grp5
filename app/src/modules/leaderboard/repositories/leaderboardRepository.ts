import { Connection } from "mongoose";
import { logger } from "../../../shared/utils/logger";
import LeaderboardEntry, {
	type ILeaderboardEntry,
} from "../models/leaderboardEntry";

class LeaderboardRepository {
	async create(
		entryData: Partial<ILeaderboardEntry>,
		teamId: string,
	): Promise<ILeaderboardEntry> {
		const data = {
			...entryData,
			teamId,
		};
		try {
			logger.info(
				`Creating leaderboard entry with data: ${JSON.stringify(entryData)}`,
			);
			const leaderboardEntry = new LeaderboardEntry(entryData);
			const savedLeaderboardEntry = await leaderboardEntry.save();
			logger.info(
				`Leaderboard Entry ${LeaderboardEntry.name} added to leaderboard`,
			);
			return savedLeaderboardEntry;
		} catch (error: any) {
			logger.error(
				`Error creating leaderboard entry: ${entryData.name} - ${error.message}`,
			);
			throw error;
		}
	}

	async findById(
		id: string,
		teamId: string,
	): Promise<ILeaderboardEntry | null> {
		try {
			const leaderboardEntry = await LeaderboardEntry.findOne({
				_id: id,
				teamId,
			});
			if (leaderboardEntry) {
				logger.info(`Leaderboard Entry found by id: ${id}`);
			} else {
				logger.warn(`No Leaderboard Entry found for id: ${id}`);
			}
			return leaderboardEntry;
		} catch (error: any) {
			logger.error(
				`Error finding leaderboard entry by id: ${id} - ${error.message}`,
			);
			throw error;
		}
	}

	async findAll(teamId: string): Promise<ILeaderboardEntry[] | null> {
		try {
			const entries = await LeaderboardEntry.find({ teamId });
			if (entries) {
				logger.info("Entries found");
			} else {
				logger.warn("No entries found for leaderboard");
			}
			return entries;
		} catch (error: any) {
			logger.error(`Error finding leaderboard entries: - ${error.message}`);
			throw error;
		}
	}

	async updateById(
		id: string,
		teamId: string,
		updateData: Partial<ILeaderboardEntry>,
	): Promise<ILeaderboardEntry | null> {
		try {
			const leaderboardEntry = await LeaderboardEntry.findByIdAndUpdate(
				{ _id: id, teamId },
				{ $set: updateData },
				{ new: true },
			);
			if (leaderboardEntry) {
				logger.info(`Leaderboard Entry updated with id ${id}`);
			} else {
				logger.warn("No leaderboard entries found");
			}

			return leaderboardEntry;
		} catch (error: any) {
			logger.error(
				`Error updating LeaderboardEntry by id: ${id} - ${error.message}`,
			);
			throw error;
		}
	}

	async deleteById(id: string, teamId: string): Promise<boolean | null> {
		try {
			const leaderboardEntry = await LeaderboardEntry.deleteOne({
				_id: id,
				teamId,
			});
			if (leaderboardEntry.deletedCount > 0) {
				logger.info("Leaderboard Entry deleted");
			} else {
				logger.warn(`No leaderboard entry found for id: ${id}`);
			}
			return leaderboardEntry.deletedCount > 0;
		} catch (error: any) {
			logger.error(
				`Error deleting leaderboard entry by id: ${id} - ${error.message}`,
			);
			throw error;
		}
	}
}

export default new LeaderboardRepository();

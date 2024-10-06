import { Connection } from "mongoose";
import { logger } from "../../../shared/utils/logger";
import UserEntry, { type IUserEntry } from "../models/userEntry";

class LeaderboardRepository {
    private userEntryModel;

    constructor(private connection: Connection) {
        // Create the UserEntry model using the connection passed to the repository
        this.userEntryModel = UserEntry(this.connection);
    }

    async create(entryData: Partial<IUserEntry>): Promise<IUserEntry> {
        try {
            logger.info(`Creating user entry with data: ${JSON.stringify(entryData)}`);
            const userEntry = new this.userEntryModel(entryData);
            const savedUserEntry = await userEntry.save();
            logger.info(`User Entry ${userEntry.name} added to leaderboard`);
            return savedUserEntry;
        } catch (error: any) {
            logger.error(`Error creating user entry: ${entryData.name} - ${error.message}`);
            throw error;
        }
    }

    async findById(id: string): Promise<IUserEntry | null> {
        try {
            const userEntry = this.userEntryModel.findOne({ _id: id });
            return userEntry;
        } catch (error: any) {
            logger.error(`Error finding user entry by id: ${id} - ${error.message}`);
            throw error;
        }
    }

    async findAll(): Promise<IUserEntry[] | null> {
        try {
            const userEntries = await this.userEntryModel.find({});
            if (userEntries) {
                logger.info(`User Entries found`);
            } else {
                logger.warn(`No user entries found for leaderboard`);
            }
            return userEntries;
        } catch (error: any) {
            logger.error(`Error finding user entries in leaderboard: - ${error.message}`);
            throw error;
        }
    }

    async updateById(id: string, updateData: Partial<IUserEntry>,): Promise<IUserEntry | null> {
        try {
            const userEntry = this.userEntryModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true },
            );
            return userEntry;
        } catch (error: any) {
            logger.error(`Error updating userentry by id: ${id} in leaderboard - ${error.message}`);
            throw error;
        }
    }

    async deleteById(id: string): Promise<boolean | null> {
        try {
            const userEntry = await this.userEntryModel.deleteOne({ _id: id });
            if (userEntry.deletedCount > 0) {
                logger.info(`User entry in leaderboared deleted`);
            } else {
                logger.warn(`No user entry found for id: ${id} in leaderboard`);
            }
            return userEntry.deletedCount > 0;
        } catch (error: any) {
            logger.error(`Error deleting user entry by id: ${id} in leaderboard - ${error.message}`);
            throw error;
        }
    }
} 

export default LeaderboardRepository;


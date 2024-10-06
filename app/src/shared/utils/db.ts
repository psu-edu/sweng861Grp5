import mongoose, { Connection } from "mongoose";
import { logger } from "./logger";
import { mongo } from "./constants";

export default function connectDB(connectionString: string): Connection {
    let dbConnection: Connection;

    try {
        dbConnection = mongoose.createConnection(connectionString);
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }

    dbConnection.once("open", () => {
        logger.info(`Database connected: ${connectionString}`);
    });

    dbConnection.on("error", (err) => {
        logger.error(`String ${connectionString}`);
        logger.error(`connection error: ${err}`);
    });

    return dbConnection;
};

export const usersDB = connectDB(mongo.usersConnectionString);
export const leaderboardsDB = connectDB(mongo.leaderboardsConnectionString);
export const groupsDB = connectDB(mongo.groupsConnectionString);
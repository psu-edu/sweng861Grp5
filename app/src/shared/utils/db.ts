import mongoose from "mongoose";
import { mongo } from "./constants";
import { logger } from "./logger";

export default function connectDB(dbName: string) {
	try {
		mongoose.connect(`mongo.connectionString/${dbName}`);
	} catch (err: any) {
		logger.error(err.message);
		process.exit(1);
	}
	const dbConnection = mongoose.connection;
	dbConnection.once("open", (_) => {
		logger.info(`Database connected: ${mongo.connectionString}`);
	});

	dbConnection.on("error", (err) => {
		logger.error(`String ${mongo.connectionString}`);
		logger.error(`connection error: ${err}`);
	});
	return;
}

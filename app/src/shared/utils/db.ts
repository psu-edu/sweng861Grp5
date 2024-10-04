import mongoose from "mongoose";
import { mongo } from "./constants";
import { logger } from "./logger";

export default function connectDB() {
	const url = "mongodb://localhost:27017/";

	try {
		mongoose.connect(url, {
			dbName: process.env.DB_NAME,
			user: process.env.DB_USER,
			pass: process.env.DB_PASS,
		});
	} catch (err: any) {
		logger.error(err.message);
		process.exit(1);
	}
	const dbConnection = mongoose.connection;
	dbConnection.once("open", (_) => {
		logger.info(`Database connected: ${url}`);
	});
		process.exit(1);
	}
	const dbConnection = mongoose.connection;
	dbConnection.once("open", (_) => {
		logger.info(`Database connected: ${url}`);
	});

	dbConnection.on("error", (err) => {
		logger.error(`connection error: ${err}`);
	});
	return;
}

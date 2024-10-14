import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import session from "express-session";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./modules/auth/routes/authRoutes";
import goalRoutes from "./modules/goals/routes/goalRoutes";
import userRoutes from "./modules/user/routes/userRoutes";
import AsyncUserService from "./modules/user/service/userAsyncService";
import vitalRoutes from "./modules/vital/routes/vitalRoutes";
import VitalService from "./modules/vital/services/vitalService";
import { morganMiddleware } from "./shared/middleware/morgan.middleware";
import CacheService from "./shared/utils/cacheService";
import { application } from "./shared/utils/constants";
import connectDB from "./shared/utils/db";
import { logger } from "./shared/utils/logger";
import mqConnection from "./shared/utils/rabbitmq";
import { swaggerOptions } from "./shared/utils/swaggerDef";

const app: Express = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);

app.use(
	session({
		secret: process.env.SECRET_KEY || "my-little-secret",
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
	const swaggerDocs = swaggerJsDoc(swaggerOptions());
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
	console.log("✅ Swagger documentation enabled at /docs");
} else {
	console.log("🚫 Swagger documentation disabled in production");
}

app.use("/", goalRoutes);
app.use("/vital", vitalRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

connectDB();

(async function MqBootstrap() {
	await mqConnection.connect();

	CacheService;
	logger.info("CacheService started listening to events");

	VitalService;
	logger.info("VitalService started listening to events");

	AsyncUserService;
	logger.info("AsyncUserService started listening to events");
})();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	logger.error(`Global error: ${err.message}`);
	res.status(500).json({ error: err.message });
});

app.listen(application.PORT, () => {
	logger.info(
		`[server]: Server is running at http://localhost:${application.PORT}`,
	);
});

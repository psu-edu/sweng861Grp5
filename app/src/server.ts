import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { morganMiddleware } from "./shared/middleware/morgan.middleware";
import connectDB from "./shared/utils/db";
import { logger } from "./shared/utils/logger";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	logger.error(`Global error: ${err.message}`);
	res.status(500).json({ error: err.message });
});

app.listen(port, () => {
	logger.info(`[server]: Server is running at http://localhost:${port}`);
});

import dotenv from "dotenv";
dotenv.config();

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import session from "express-session";
import goalRoutes from "./modules/goals/routes/goalRoutes";
import { morganMiddleware } from "./shared/middleware/morgan.middleware";
import connectDB from "./shared/utils/db";
import { logger } from "./shared/utils/logger";
import mqConnection from "./shared/utils/rabbitmq";
import CacheService from "./shared/utils/cacheService";

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());

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

app.use("/", goalRoutes);

connectDB();

(async function MqBootstrap() {
  await mqConnection.connect();

  CacheService;
  logger.info("CacheService started listening to events");
})();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global error: ${err.message}`);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

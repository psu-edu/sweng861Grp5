import dotenv from "dotenv";
dotenv.config();

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import goalRoutes from "./modules/goals/routes/goalRoutes";
import leaderboardRoutes from "./modules/leaderboard/routes/leaderboardRoutes";
import { morganMiddleware } from "./shared/middleware/morgan.middleware";
import { logger } from "./shared/utils/logger";
import createUserEntryModel from "./modules/leaderboard/models/userEntry";
import LeaderboardService from './modules/leaderboard/services/leaderboardService';
import { usersDB, leaderboardsDB, groupsDB } from './shared/utils/db';
import basicAuth from "express-basic-auth";
const app: Express = express();
const port = process.env.PORT || 8000;

app.use(basicAuth({
    users: { 'app_username': 'app_password' },
    challenge: true,
    unauthorizedResponse: 'Unauthorized'
}));

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

app.use('/api', leaderboardRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global error: ${err.message}`);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

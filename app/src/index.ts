import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import goalRoutes from "./modules/goals/routes/goalRoutes";
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

connectDB();

(async function MqBootstrap() {
  await mqConnection.connect();

  CacheService;
  logger.info("CacheService started listening to events");

  VitalService;
  logger.info("VitalService started listening to events");
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

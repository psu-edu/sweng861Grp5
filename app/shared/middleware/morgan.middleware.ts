import morgan from "morgan";
import { logger } from "../utils/logger.ts";

const stream = {
  write: (message: string) => logger.http(message),
};

export const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream },
);

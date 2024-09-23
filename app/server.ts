import express, { Request, Response } from "express";
import { morganMiddleware } from "./shared/middleware/morgan.middleware.ts";
import { logger } from "./shared/utils/logger.ts";

const app = express();
const port = 8000; // Port where the server will listen

app.use(morganMiddleware);

// Define a simple route that responds with "Hello, World!"
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Start the Express server
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

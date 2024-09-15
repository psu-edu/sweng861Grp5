import express, { Request, Response } from "express";

const app = express();
const port = 8000; // Port where the server will listen

// Define a simple route that responds with "Hello, World!"
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

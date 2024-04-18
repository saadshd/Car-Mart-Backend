import express, { Request, Response } from "express";
import connectDB from "./db/connect";
import { error } from "./utils/apiResponse";
import routes from "./routes/index";
import config from "./config";
import cors from "cors";
import path from "path";

const app = express();

//Middleware - Plugin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.86.37:3000",
      "http://192.168.86.212:3000",
    ],
    credentials: true,
  })
);

// Serve uploaded files
app.use(express.static(path.join(__dirname, "../public")));

//Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to CAR MART");
});

app.use("/" + config.apiPrefix, routes);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json(error(`Can't find ${req.originalUrl}`));
});

// Database Connection
connectDB();

// Start the Server
const server = app.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});

// Close the Server
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  server.close(() => {
    console.log("Server has been gracefully terminated.");
    process.exit(0);
  });
});

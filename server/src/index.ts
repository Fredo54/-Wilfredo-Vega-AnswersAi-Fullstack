import "dotenv/config";
import OpenAI from "openai";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import express, { Request, Response, NextFunction } from "express";
import { rateLimiterUsingThirdParty } from "./rateLimiter";
import UserRoutes from "./routes/userRoutes";
import ChatRoutes from "./routes/chatRoutes";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import WsController from "./controller/wsController";
import jwt from "jsonwebtoken";

export const openai = new OpenAI();
const client = postgres(process.env.DB_URL as string);
const db = drizzle(client);

export enum ResponseState {
  Pending = "pending",
  Success = "success",
  Error = "error",
}

export type Message = {
  userId: string;
  message: string;
  responseState: ResponseState;
  response: string;
};

const app = express();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(rateLimiterUsingThirdParty);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("middleware");
  if (401 === err.status) {
    res.redirect("/login");
  }
});

app.use("/api", UserRoutes);
app.use("/api", ChatRoutes);

io.use((socket, next) => {
  // Bug that won't let me import this
  // socketAuthMiddleware(socket, next);

  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return next(new Error(err.message));
    } else {
      next();
    }
  });
});

io.on("connection", (socket) => {
  WsController.handleConnect(socket);

  socket.on("disconnect", () => {
    WsController.handleDisconnect(socket);
  });

  socket.on("chat message", (message: Message) => {
    WsController.handleChatMessage(socket, message);
  });

  socket.on("get tokens", ({ userId }: { userId: string }) => {
    WsController.getTokens(socket, userId);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  res.send("Login Screen!");
});

server.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

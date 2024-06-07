import "dotenv/config";
import express from "express";
import ChatsController from "../controller/chatsController";
import { authMiddleware } from "../auth";

const router = express.Router();

router.get("/chats/all", authMiddleware, ChatsController.getAllChats);

export default router;

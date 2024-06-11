import "dotenv/config";
import { Request, Response } from "express";
import ChatsService from "../service/chatsService";

class ChatsController {
  static async getAllChats(req: Request, res: Response) {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId field!" });
    }

    try {
      const chats = await ChatsService.getAllChats({ userId });
      return res.status(200).json({ chats });
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async insertChats(req: Request, res: Response) {
    const { userId, message, response } = req.body;
    if (!userId || !message || !response) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      ChatsService.insertChat({ userId, message, response });
      return res.status(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default ChatsController;

import "dotenv/config";
import { db } from "../db";
import { users, chats } from "../../schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

class ChatsController {
  static async getAllChats(req: Request, res: Response) {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      return res.status(400).json({ error: "missing userId!" });
    }

    try {
      // limit to 10 for now
      const allChats = await db
        .select({
          id: chats.id,
          userId: chats.userId,
          message: chats.message,
          response: chats.response,
          createdAt: chats.createdAt,
        })
        .from(chats)
        .leftJoin(users, eq(chats.userId, users.id))
        .where(eq(users.id, parseInt(userId)))
        .limit(10);

      res.json({ chats: allChats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
  static async insertChat({
    userId,
    message,
    response,
  }: {
    userId: number;
    message: string;
    response: string;
  }) {
    return await db
      .insert(chats)
      .values({
        userId,
        message,
        response,
        createdAt: new Date(),
      })
      .returning();
  }
}

export default ChatsController;

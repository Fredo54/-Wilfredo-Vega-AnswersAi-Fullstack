import { db } from "../db";
import { chats } from "../../schema";
import { desc, eq } from "drizzle-orm";

export default class ChatsService {
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

  static async getAllChats({ userId }: { userId: string }) {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId as unknown as number))
      .orderBy(desc(chats.createdAt));
  }
}

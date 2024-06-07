import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { tokens } from "../../schema";

const truncateToDay = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default class TokenService {
  static async getTokenUsage({ userId }: { userId: string }) {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const truncatedDate = truncateToDay(today);
    const truncatedNextDate = truncateToDay(nextDay);

    let tokenCount = await db
      .select()
      .from(tokens)
      .where(
        and(
          eq(tokens.userId, parseInt(userId)),
          gte(tokens.createdAt, truncatedDate),
          lte(tokens.createdAt, truncatedNextDate)
        )
      );

    if (tokenCount.length === 0) {
      tokenCount = await TokenService.initializeUserTokens({ userId });
    }

    return tokenCount;
  }

  static async updateTokenUsage({
    userId,
    tokensUsed,
  }: {
    userId: string;
    tokensUsed: number;
  }) {
    const userToken = await TokenService.getTokenUsage({ userId });

    await db
      .update(tokens)
      .set({
        tokenCount: userToken[0].tokenCount - tokensUsed,
      })
      .where(eq(tokens.id, userToken[0].id));

    return userToken;
  }

  static async initializeUserTokens({ userId: id }: { userId: string }) {
    const today = new Date().toISOString();
    const userTokens = await db
      .insert(tokens)
      .values({
        userId: parseInt(id),
        tokenCount: 50,
        requestCount: 0,
        createdAt: today,
        updatedAt: today,
      })
      .returning();

    return userTokens;
  }
}

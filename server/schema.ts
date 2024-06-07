import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  fullName: varchar("fullName").notNull(),
  password: varchar("password").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("userId").notNull(),
  message: varchar("message").notNull(),
  response: varchar("response").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Unique constraint on user_id and date to ensure each user has one entry per day.
export const tokens = pgTable(
  "tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId").notNull(),
    tokenCount: integer("token").notNull(),
    requestCount: integer("requestCount").notNull(),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uniqueUserDate: unique().on(t.userId, t.createdAt),
  })
);

// Unique constraint on user_id and reset_time to manage rate limiting per user.
// export const rateLimits = pgTable(
//   "rateLimits",
//   {
//     id: serial("id").primaryKey(),
//     userId: integer("userId").references(() => users.id),
//     requestCount: integer("requestCount").notNull(),
//     resetTime: timestamp("resetTime").notNull(),
//     createdAt: timestamp("createdAt").defaultNow().notNull(),
//   },
//   (t) => ({
//     uniqueUserReset: unique().on(t.userId, t.resetTime),
//   })
// );

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

// export const rateLimitsRelations = relations(rateLimits, ({ one }) => ({
//   user: one(users, {
//     fields: [rateLimits.userId],
//     references: [users.id],
//   }),
// }));

import "dotenv/config";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../../schema";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

class UserController {
  static async register(req: Request, res: Response) {
    const { email, password, fullName } = req.body;
    if (UserController.missingParams(email, password, fullName)) {
      return res
        .status(400)
        .json({ error: "Please provide email, password, and full name" });
    }

    const existingUser = await UserController.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = await UserController.insertNewUser(
      email,
      password,
      fullName
    );
    const token = UserController.generateToken(email, newUser.id);
    res.json({ userId: newUser.id, token });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (UserController.missingParams(email, password)) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserController.checkUserCredentials(email, password);

    if (!user || user.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = UserController.generateToken(email, user[0].id);
    res.json({ token });
  }

  static async dashboard(req: Request, res: Response) {
    res.send("Dashboard");
  }

  static async getUserByEmail(req: Request, res: Response) {
    const { email } = req.body;
    if (UserController.missingParams(email)) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await UserController.findUserByEmail(email);
    res.send({ user });
  }

  static async insertNewUser(
    email: string,
    password: string,
    fullName: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db
      .insert(users)
      .values({
        email,
        fullName,
        password: hashedPassword,
        createdAt: new Date(),
      })
      .returning();
    return user[0];
  }

  static async checkUserCredentials(email: string, password: string) {
    const user = await UserController.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user?.password as string))) {
      return null;
    }
    return await db.select().from(users).where(eq(users.email, email));
  }

  static async findUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user && user.length > 0 ? user[0] : null;
  }

  static generateToken(email: string, id: number) {
    return jwt.sign({ email, id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  }

  static missingParams(...params: string[]) {
    return params.some((param) => !param);
  }
}

export default UserController;

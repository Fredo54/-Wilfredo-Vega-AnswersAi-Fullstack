import "dotenv/config";
import express from "express";
import UserController from "../controller/userController";
import { authMiddleware } from "../auth";

const router = express.Router();

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users/dashboard", authMiddleware, UserController.dashboard);
router.get("/users", authMiddleware, UserController.getUserByEmail);

export default router;

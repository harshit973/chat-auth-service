import express from "express"
import { getStatus, getUsers, updateStatus } from "../controllers/UserController.js";
import verifyToken from "../middleware/verifyToken.js";

export const userRouter = express.Router();

userRouter.patch("/:authName/status",updateStatus)
userRouter.use(verifyToken)
userRouter.get("/",getUsers)
userRouter.post("/status",getStatus)
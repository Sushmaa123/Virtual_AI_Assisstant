import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

// accepts either FormData (uses multer) or JSON (no file)
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);

// your existing frontend uses this endpoint
userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;

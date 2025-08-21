import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import geminiResponse from "../services/gemini.js";
import User from "../models/user.model.js";

const router = express.Router();

// POST /api/gemini
router.post("/", isAuth, async (req, res) => {
  try {
    const { command } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure assistant name is taken from DB, fallback only if missing
    const assistantName =
      user.AssistantName && user.AssistantName.trim() !== ""
        ? user.AssistantName
        : "Virtual AI";

    // ✅ Pass both assistantName + username but enforce assistantName
    const response = await geminiResponse(command, assistantName, user.name);

    // ✅ Ensure backend never sends username instead of assistantName
    let parsed;
    try {
      parsed = JSON.parse(response);
      if (parsed.response.includes(user.name)) {
        parsed.response = parsed.response.replace(user.name, assistantName);
      }
    } catch (err) {
      parsed = { type: "general", userInput: command, response: response };
    }

    res.json(parsed);
  } catch (error) {
    console.error("Gemini route error:", error);
    res.status(500).json({ message: "Gemini API error" });
  }
});

export default router;
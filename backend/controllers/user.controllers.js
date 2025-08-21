import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";

// GET /api/user/current
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/user/update (FormData or JSON)
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body; // JSON fields OR text fields in FormData
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof assistantName === "string") {
      user.assistantName = assistantName.trim();
    }

    // Image can come either via multer file upload or via a direct URL
    if (req.file) {
      // adjust to your static path if needed
      user.assistantImage = `/uploads/${req.file.filename}`;
    } else if (typeof imageUrl === "string" && imageUrl.trim().length > 0) {
      user.assistantImage = imageUrl.trim();
    }

    await user.save();

    const safe = user.toObject();
    delete safe.password;
    res.json(safe); // ✅ return pure user object (what your frontend expects)
  } catch (error) {
    console.error("Update assistant error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// POST /api/user/asktoassistant  (kept for your existing frontend)
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command || !command.trim()) {
      return res.status(400).json({ message: "command is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const assistantName = user.assistantName || "Virtual AI";

    const response = await geminiResponse(command, assistantName, user.name);
    res.json({ response });
  } catch (error) {
    console.error("Ask to assistant error:", error);
    res.status(500).json({ message: "Gemini API error" });
  }
};
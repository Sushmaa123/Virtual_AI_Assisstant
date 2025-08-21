import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ keep lowercase everywhere
    assistantName: { type: String, default: "Virtual AI" },
    assistantImage: { type: String, default: "" },

    history: [{ type: String }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

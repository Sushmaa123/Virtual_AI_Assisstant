import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"

const app = express()

app.use(cors({
    origin: process.env.VITE_API_BASE_URL || "http://localhost:3000",
    credentials: true
}))

const port = process.env.PORT || 8000

app.use(express.json())
app.use(cookieParser())

// Root route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀")
})

// API routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`)
})
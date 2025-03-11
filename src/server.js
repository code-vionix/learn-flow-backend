import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { config } from "./config/index.js"
import routes from "./routes/index.js"
import { errorHandler } from "./middleware/errorHandler.js"

// Initialize express app
const app = express()

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS
app.use(morgan("dev")) // Request logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// API Routes
app.use("/api/v1", routes)

// Docs endpoint
app.get('/docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/26564987/2sAYk7T4Q5');
});


// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = config.port || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app


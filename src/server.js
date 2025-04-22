import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { config } from "./config/index.js"
import routes from "./routes/index.js"
import { errorHandler } from "./middleware/errorHandler.js"
import socketInit from "../socket/index.js"
// Initialize express app
const app = express();

const server = http.createServer(app) // Create HTTP server for Socket.IO

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use("/api/v1", routes)

app.get('/docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/26564987/2sAYk7T4Q5');
})

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use(errorHandler)

// Start server
const PORT = config.port || 3000
server.listen(PORT, () => {
    socketInit(server);
  console.log(`Server running on port ${PORT}`)
})

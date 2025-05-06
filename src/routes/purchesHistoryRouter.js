import express from "express";
import { purchesHistory } from "../controllers/purchesHistoryController.js";

const purchesRouter = express.Router();

purchesRouter.get("/history/:userId", purchesHistory);

export default purchesRouter;

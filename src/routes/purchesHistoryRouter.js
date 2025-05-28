import express from "express";
import { purchesHistory } from "../controllers/purchesHistoryController.js";
import { protect } from "../middleware/auth.js";
const purchesRouter = express.Router();


purchesRouter.get("/history",protect, purchesHistory);

export default purchesRouter;

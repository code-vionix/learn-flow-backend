import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadToCloudinary);
// for multiple files
router.post("/multiple", upload.array("files"), uploadToCloudinary);

export default router;

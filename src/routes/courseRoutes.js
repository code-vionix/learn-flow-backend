import express from "express";
import multer from "multer";
import {
  createCourse,
  DeleteCourse,
  getAllCourse,
  getCourseById,
  UpdateCourse,
} from "../controllers/courseController.js";

const router = express.Router();

const upload = multer({
  
  storage: multer.diskStorage({}),
  // limits: {fileSize : 5000000},

  });



// Public routes
router.post("/", createCourse);
router.get("/", getAllCourse);
router.get("/:id", getCourseById);
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  UpdateCourse
);
// router.patch("/:id", UpdateCourse);
router.delete("/:id", DeleteCourse);

export default router;

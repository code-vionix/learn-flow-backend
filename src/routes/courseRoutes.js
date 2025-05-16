import express from "express";
import multer from "multer";
import {
  createCourse,
  DeleteCourse,
  getAllCourse,
  getCourseById,
  getCourseRequirementsByCourseId,
  getInstructorByCourseId,
  getLearningsByCourseId,
  getModulesByCourseId,
  getTargetAudiencesByCourseId,
  UpdateCourse,
} from "../controllers/courseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  
  storage: multer.diskStorage({}),
  // limits: {fileSize : 5000000},

  });



// Public routes
router.post("/", protect, createCourse);
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
router.get("/:courseId/instructor", getInstructorByCourseId);
router.get("/:courseId/modules", getModulesByCourseId);
router.get("/:courseId/learnings", getLearningsByCourseId);
router.get("/:courseId/targetAudiences", getTargetAudiencesByCourseId);
router.get("/:courseId/requirements", getCourseRequirementsByCourseId);

export default router;

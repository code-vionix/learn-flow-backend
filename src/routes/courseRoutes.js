import express from "express";
import multer from "multer";
import {
  createCourse,
  DeleteCourse,
  getAllCourse,
  getBestSellingCourses,
  getBestSellingCoursesByCategory,
  getCourseById,
  getCourseRequirementsByCourseId,
  getEnrolmentByCourseId,
  getFeaturedCourses,
  getInstructorByCourseId,
  getLearningsByCourseId,
  getModulesByCourseId,
  getReviewsByCourseId,
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
router.get("/best-selling", getBestSellingCourses);
router.get("/featured-course", getFeaturedCourses);
router.get("/best-selling-category", getBestSellingCoursesByCategory);
router.get("/:id", getCourseById);
router.put(
  "/:id",protect,
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
router.get("/:courseId/reviews", getReviewsByCourseId);
router.get("/:courseId/enrolments", getEnrolmentByCourseId);

export default router;

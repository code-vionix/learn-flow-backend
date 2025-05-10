import express from "express";
import { createInstructor, deleteInstructor, getAllInstructors, getInstructorById, updateInstructor } from "../controllers/instructorController.js";
// import {
//   createInstructor,
//   deleteInstructor,
//   getAllInstructors,
//   getInstructorsById,
//   updateInstructor,
// } from "../controllers/instructorController.js";

// const router = express.Router();

// // Public routes
// router.post("/", createInstructor);
// router.get("/", getAllInstructors);
// router.get("/:id", getInstructorsById);
// router.patch("/:id", updateInstructor);
// router.delete("/:id", deleteInstructor);

// export default router;


const router = express.Router();

// Instructor Routes
router.post("/", createInstructor);       // ✅ Create
router.get("/", getAllInstructors);        // ✅ Get All
router.get("/:id", getInstructorById);    // ✅ Get Single
router.put("/:id", updateInstructor);     // ✅ Update
router.delete("/:id", deleteInstructor);  // ✅ Delete

export default router;
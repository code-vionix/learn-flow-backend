import express from "express";
import { createAssignment, deleteAssignment, getAllAssignments, getSingleAssignment, updateAssignment } from "../controllers/assignmentController.js";


const assignmentRouter = express.Router();

assignmentRouter.get("/", getAllAssignments);
assignmentRouter.get("/:id", getSingleAssignment);

assignmentRouter.post("/", createAssignment);

assignmentRouter.patch("/:id", updateAssignment);

assignmentRouter.delete("/:id", deleteAssignment);

export default assignmentRouter;

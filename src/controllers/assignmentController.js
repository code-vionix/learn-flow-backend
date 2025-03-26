import { assignmentService } from "../services/assignmentService.js";

export const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.status(200).json(assignments);
  }
  catch (error) {
    next(error);
  }
}
export const getSingleAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentService.getSingleAssignment(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const {
      title,
      description,
      dueDate,
      moduleId,
      courseId,
      maxPoints,
      allowLateSubmissions,
    } = req.body;


    const assignment = await assignmentService.createAssignment({
      title,
      description,
      dueDate,
      moduleId,
      courseId,
      maxPoints,
      allowLateSubmissions,
    });

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignmentData = req.body;
    const assignment = await assignmentService.updateAssignmentService(id, assignmentData);
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentService.deleteAssignment(id);
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
};
// import { moduleService } from "../services/moduleService.js";

// export const getAllModulesData = async (req, res, next) => {
//   try {
//     const modules = await moduleService.getAllModules();
//     //check module is deletedat

//     if (!modules) {
//       return res.status(404).json({ message: "No modules found" });
//     }

//     res.status(200).json(modules);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getSingleModuleWith = async (req, res, next) => {
//   try {
//     const { moduleId } = req.params;

//     const moduleData = await moduleService.getSingleModuleWithCourse(moduleId);

//     if (!moduleData) {
//       return res.status(404).json({ message: "Module not found" });
//     }

//     res.status(200).json(moduleData);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createModule = async (req, res, next) => {
//   try {
//     const { title, courseId, order } = req?.body;

//     const moduleInfo = await moduleService.createModule({
//       title,
//       courseId,
//       order,
//     });

//     res.status(201).json(moduleInfo);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateModule = async (req, res, next) => {
//   try {
//     const { moduleId } = req.params;
//     const { title, courseId, order } = req.body;

//     const updatedModule = await moduleService.updateModule(moduleId, {
//       title,
//       courseId,
//       order,
//     });

//     if (!updatedModule) {
//       return res.status(404).json({ message: "Module not found" });
//     }

//     res.status(200).json(updatedModule);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteModule = async (req, res, next) => {
//   try {
//     const { moduleId } = req.params;
//     console.log("module id : ", moduleId);
//     const deleteModule = await moduleService.deleteModule(moduleId);

//     if (!deleteModule) {
//       return res.status(404).json({ message: "Module not found" });
//     }

//     res.status(200).json(deleteModule);
//   } catch (error) {
//     next(error);
//   }
// };
// src/controllers/moduleController.ts
// src/controllers/moduleController.ts

import moduleService from "../services/moduleService";

const moduleController = {
  async createModule(req, res) {
    try {
      const courseId = req.params.courseId;
      const { title, order } = req.body; // order might be null/undefined

      if (!title) {
        return res.status(400).json({ message: "Module title is required" });
      }

      // Data for creation
      const moduleData = {
        title: title,
        // order is handled by service
        course: { connect: { id: courseId } }, // Ensure courseId is used
      };

      const newModule = await moduleService.createModule(courseId, moduleData);
      res.status(201).json(newModule);
    } catch (error) {
      console.error("Error creating module:", error);
      res
        .status(500)
        .json({ message: "Failed to create module", error: error.message });
    }
  },

  async updateModule(req, res) {
    try {
      const moduleId = req.params.moduleId;
      const updateData = req.body; // Allow partial updates

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedModule = await moduleService.updateModule(
        moduleId,
        updateData
      );

      if (!updatedModule) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      res
        .status(500)
        .json({ message: "Failed to update module", error: error.message });
    }
  },

  async deleteModule(req, res) {
    try {
      const moduleId = req.params.moduleId;
      await moduleService.deleteModule(moduleId);
      res.sendStatus(204); // No content on successful deletion
    } catch (error) {
      console.error("Error deleting module:", error);
      // Check for specific errors like 'Not Found' if service throws them
      res
        .status(500)
        .json({ message: "Failed to delete module", error: error.message });
    }
  },
};

export default moduleController;
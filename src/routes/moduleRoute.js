import express from "express"
import moduleController from "../controllers/moduleController.js";
 

const moduleRouter = express.Router(); 

// moduleRouter.get("/", getAllModulesData)  
// moduleRouter.get("/:moduleId", getSingleModuleWith)  

// moduleRouter.post("/", createModule)  

// moduleRouter.patch("/:moduleId", updateModule);

// moduleRouter.delete("/:moduleId", deleteModule)

// Note: Module creation includes courseId in the path as it's a child resource creation
router.post('/courses/:courseId/modules', moduleController.createModule);
router.put('/:moduleId', moduleController.updateModule); // Update a specific module by its ID
router.delete('/:moduleId', moduleController.deleteModule);
export default moduleRouter


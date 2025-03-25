import express from "express"
import { createModule, deleteModule, getAllModulesData, getSingleModuleWith, updateModule } from "../controllers/moduleController.js";
 

const moduleRouter = express.Router(); 

moduleRouter.get("/", getAllModulesData)  
moduleRouter.get("/:moduleId", getSingleModuleWith)  

moduleRouter.post("/", createModule)  

moduleRouter.patch("/:moduleId", updateModule);

moduleRouter.delete("/:moduleId", deleteModule)

export default moduleRouter


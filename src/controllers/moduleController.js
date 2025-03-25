import { moduleService } from "../services/moduleService.js"


export const getAllModulesData = async (req, res, next) => {
    try {
        const modules = await moduleService.getAllModules();
        //check module is deletedat

        if (!modules) {
            return res.status(404).json({ message: "No modules found" });
        }

        res.status(200).json(modules);
    } catch (error) {
        next(error);
    }
};

export const getSingleModuleWith = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const moduleData = await moduleService.getSingleModuleWithCourse(moduleId);

    if (!moduleData) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(moduleData);
  } catch (error) {
    next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
      const { 
          title,
        courseId,
        order,
     } = req?.body

    const moduleInfo = await moduleService.createModule({
        title,
      courseId,
      order
    })

    res.status(201).json(moduleInfo)
  } catch (error) {
    next(error)
  }
}

export const updateModule = async (req, res, next) => {
    try {
        const { moduleId } = req.params;
        const { title, courseId, order } = req.body;
    
        const updatedModule = await moduleService.updateModule(moduleId, {
        title,
        courseId,
        order,
        });
    
        if (!updatedModule) {
        return res.status(404).json({ message: "Module not found" });
        }
    
        res.status(200).json(updatedModule);
    } catch (error) {
        next(error);
    }
    }

export const deleteModule = async (req, res, next) => {
    try {
        const { moduleId } = req.params;
        console.log("module id : ", moduleId);
        const deleteModule = await moduleService.deleteModule(moduleId);
        
        if (!deleteModule) {
            return res.status(404).json({ message: "Module not found" });
        }
        
        res.status(200).json(deleteModule);
    } catch (error) {
        next(error);
    }
}
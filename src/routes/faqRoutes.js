import express from "express";
import { createFaqGroup, deleteFaqGroup, getAllFaqGroups, getFaqByRole,getFaqGroupByCategoryId,getFaqGroups, updateFaqGroup } from "../controllers/faqController.js";
 
const router = express.Router();

// ✅ Put all static routes before dynamic ones
router.post("/category", getFaqGroups);       // create categories
router.post("/", createFaqGroup);            // create FAQ group
router.get("/", getAllFaqGroups);            // get all FAQ groups
router.get("/category", getFaqGroups);       // get only FAQ groups (category list)
router.get("/category/:id", getFaqGroupByCategoryId);         // get one by ID
router.get("/:role", getFaqByRole);         // get one by ID
router.put("/:id", updateFaqGroup);          // update by ID
router.delete("/:id", deleteFaqGroup);       // delete by ID

export default router;

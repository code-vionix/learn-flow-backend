import express from "express";
import {
  createFaqGroup,
  deleteFaqGroup,
  getAllFaqGroups,
  getFaqByRole,
  getFaqGroupByCategoryId,
  getFaqGroups,
  updateFaqGroup,
  updateFaq,
  createFaq,
} from "../controllers/faqController.js";

const router = express.Router();

// ✅ Put all static routes before dynamic ones
router.post("/category", createFaqGroup); // create FAQ group
router.get("/", getAllFaqGroups); // get all FAQ groups
router.get("/category", getFaqGroups); // get only FAQ groups (category list)
router.get("/category/:id", getFaqGroupByCategoryId); // get one by ID
router.get("/:role", getFaqByRole); // get one by ID

router.delete("/category/:id", deleteFaqGroup); // delete by ID

router.put("/category/:id", updateFaqGroup); // update faq group by ID

router.post("/", createFaq);
router.put("/:id", updateFaq); // update by ID

export default router;

import express from "express";
import { createContact, deleteContact, getAllContacts, getContactById } from "../controllers/contactController.js";
 
const router = express.Router();

// Instructor Routes
router.post("/", createContact);       // ✅ Create
router.get("/", getAllContacts);        // ✅ Get All
router.get("/:id", getContactById);    // ✅ Get Single
router.delete("/:id", deleteContact);  // ✅ Delete

export default router;
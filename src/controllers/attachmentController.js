// src/controllers/attachmentController.ts
import { Request, Response } from 'express';
import attachmentService from '../services/attachmentService';
import fileStorageService from '../services/fileStorageService'; // For file operations
import multer from 'multer'; // Import multer
import { upload } from './lessonController'; // Reuse multer instance if configuration is same

// If attachment upload needs different multer config, define it here:
// const attachmentUpload = multer({ ... });


const attachmentController = {
  async uploadAttachment(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const file = req.file; // File is available here thanks to multer

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Use the file storage service to save the file
      const attachmentUrl = await fileStorageService.uploadFile(file);

      // Create a new Attachment record
      const newAttachment = await attachmentService.createAttachment(
        lessonId,
        file.originalname, // Use original file name as attachment name
        attachmentUrl
      );

      res.status(201).json(newAttachment); // Return the created attachment object
    } catch (error) {
      console.error("Error uploading attachment:", error);
      // TODO: Implement cleanup if file was uploaded but db record failed
      res.status(500).json({ message: 'Failed to upload attachment', error: error.message });
    }
  },

  async deleteAttachment(req, res) {
    try {
      const attachmentId = req.params.attachmentId;
      await attachmentService.deleteAttachment(attachmentId); // Service handles file deletion

      res.sendStatus(204); // No content
    } catch (error) {
      console.error("Error deleting attachment:", error);
       // Check for specific errors like 'Not Found' if service throws them
      res.status(500).json({ message: 'Failed to delete attachment', error: (error as Error).message });
    }
  },
};

export default attachmentController;
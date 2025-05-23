import { cloudinary } from "../config/index.js";
import path from "path";
import crypto from "crypto";

export const uploadToCloudinary = async (req, res) => {
  try {
    const generateRandomPrefix = () => crypto.randomBytes(3).toString("hex"); // e.g., "a1b2c3"

    const uploadFile = async (file) => {
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const originalName = path.parse(file.originalname).name;
      const randomPrefix = generateRandomPrefix();
      const publicId = `${randomPrefix}-${originalName}`;

      const result = await cloudinary.uploader.upload(base64String, {
        public_id: publicId,
        resource_type: "auto",
        overwrite: false,
      });

      return {
        url: result.secure_url,
        originalName: file.originalname,
        public_id: result.public_id,
      };
    };

    // Handle multiple files
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await Promise.all(req.files.map(uploadFile));
      return res.status(200).json({ files: uploadedFiles });
    }

    // Handle single file
    if (req.file) {
      const uploadedFile = await uploadFile(req.file);
      return res.status(200).json(uploadedFile);
    }

    return res.status(400).json({ error: "No file(s) uploaded" });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Failed to upload file(s)" });
  }
};

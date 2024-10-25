import express from "express";
import { cloudinary } from "../../config/cloudinary.config.js"; // Corrigé pour correspondre à l'exportation nommée
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configuration de Multer pour l'upload avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Assurez-vous que ce dossier existe sur Cloudinary
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

// Route pour uploader un avatar
router.post("/upload", upload.single("avatar"), (req, res) => {
  try {
    const imageUrl = req.file.path; // Récupération de l'URL de l'image
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error);
    res.status(500).json({ message: "Erreur lors de l'upload de l'avatar" });
  }
});

export default router;

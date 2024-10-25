import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // dfikgdrpn
  api_key: process.env.CLOUDINARY_API_KEY, // Votre API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Votre API Secret
});

// Configurer le stockage pour multer en utilisant Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars_prédéfinis", // Assurez-vous que ce nom correspond à celui du dossier Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export { cloudinary, upload };

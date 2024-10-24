import multer from "multer";
import path from "path";

// Configurer Multer pour stocker les fichiers téléchargés dans 'public/avatars'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("client", "public", "avatars"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Configurer multer pour limiter les types de fichiers, ici uniquement des images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Seuls les fichiers jpg, jpeg et png sont autorisés"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;

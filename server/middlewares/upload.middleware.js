import multer from "multer";

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

const upload = multer({ fileFilter });

export default upload;

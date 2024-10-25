// src/services/cloudinary.services.js
import axios from "axios";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
  ); // Doit être configuré

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'upload de l'image vers Cloudinary :",
      error
    );
    throw error;
  }
};

export { uploadImageToCloudinary };

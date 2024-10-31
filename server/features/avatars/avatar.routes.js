import express from "express";
import { cloudinary } from "../../config/cloudinary.config.js"; // Importer Cloudinary correctement configuré

const router = express.Router();

// Route pour récupérer les avatars depuis le dossier "avatars_prédéfinis" sur Cloudinary
router.get("/cloudinary/avatars", async (req, res) => {
  try {
    // Utilisation de la méthode Cloudinary pour récupérer les ressources du dossier "avatars_prédéfinis"
    cloudinary.v2.api.resources_by_asset_folder(
      "avatars_prédéfinis",
      { max_results: 100 },
      (error, result) => {
        if (error) {
          console.error("Erreur lors de la récupération des avatars :", error);
          return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des avatars." });
        }

        // Extraire les URLs des ressources récupérées
        const avatarUrls = result.resources.map(
          (resource) => resource.secure_url
        );
        res.status(200).json(avatarUrls);
      }
    );
  } catch (err) {
    console.error("Erreur lors de la récupération des avatars :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des avatars." });
  }
});

export default router;

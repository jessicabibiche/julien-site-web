import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// Fonction pour récupérer le profil utilisateur (bio uniquement)
export const getUserProfile = async (req, res) => {
  const token = req.signedCookies.token; // Récupère le cookie signé

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Récupérer l'utilisateur
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Renvoyer les informations de l'utilisateur
    const profile = {
      pseudo: user.pseudo,
      bio: user.bio,
    };

    return res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la récupération du profil utilisateur",
    });
  }
};

// Fonction pour mettre à jour la bio
export const updateBio = async (req, res) => {
  const token = req.signedCookies.token; // Récupère le cookie signé

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { bio } = req.body;

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour la bio
    user.bio = bio;
    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "Bio mise à jour avec succès",
      bio: user.bio,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la bio :", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la mise à jour de la bio",
    });
  }
};

import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";

// Fonction pour récupérer le profil utilisateur (bio uniquement)
export const getUserProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Renvoyer les informations de l'utilisateur (vérifie bien ces champs)
    const profile = {
      pseudo: user.pseudo,
      bio: user.bio,
    };

    return res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la récupération du profil utilisateur",
    });
  }
};

// Fonction pour mettre à jour la bio
export const updateBio = async (req, res) => {
  const { userId } = req.user;
  const { bio } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    user.bio = bio;
    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "Bio mise à jour avec succès",
      bio: user.bio,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la mise à jour de la bio" });
  }
};

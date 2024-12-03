import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";

// ajouter un ami

const addFriend = async (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Ami non trouvé." });
    }
    if (user.friends.some((f) => f.friendId.equals(friendId))) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: " cet utilisateur est déjà votre ami." });
    }

    user.friends.push({ friendId: friend.id, status: "offline" });
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Ami ajouté avec succés." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "erreur lors de l'ajout de l'ami." });
  }
};

// supprimer un ami
const removeFriend = async (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);

    user.friends = user.friends.filter(
      (friend) => !friend.friendId.equals(friendId)
    );

    await user.save();

    res.status(StatusCodes.OK).json({ message: "Ami supprimé avec succès." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la suppression de l'ami." });
  }
};

// Recherche d'utilisateurs par pseudo et discriminator
const searchUser = async (req, res) => {
  const { pseudo, discriminator } = req.query;

  if (!pseudo) {
    return res
      .status(400)
      .json({ message: "Le pseudo est requis pour la recherche." });
  }

  try {
    // Requête insensible à la casse
    const query = { pseudo: new RegExp(pseudo, "i") };
    if (discriminator) {
      query.discriminator = discriminator;
    }

    // Recherche des utilisateurs avec avatar et statut
    const users = await User.find(query).select(
      "pseudo discriminator avatar status"
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    // Retourner les résultats
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche d'utilisateur." });
  }
};

// Mettre à jour un avatar personnalisé
const updateAvatar = async (req, res) => {
  const { userId, avatarUrl } = req.body;

  if (!userId || !avatarUrl) {
    return res
      .status(400)
      .json({ message: "UserId et avatarUrl sont requis." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mettre à jour l'avatar
    user.avatar = avatarUrl;
    await user.save();

    res
      .status(200)
      .json({ message: "Avatar personnalisé mis à jour avec succès", user });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'avatar personnalisé :",
      error
    );
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Sélectionner un avatar prédéfini
const selectAvatar = async (req, res) => {
  const { userId, avatarUrl } = req.body;

  if (!userId || !avatarUrl) {
    return res
      .status(400)
      .json({ message: "UserId et avatarUrl sont requis." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mettre à jour avec un avatar prédéfini
    user.avatar = avatarUrl;
    await user.save();

    res
      .status(200)
      .json({ message: "Avatar prédéfini sélectionné avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la sélection de l'avatar prédéfini :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Uploader un avatar depuis un téléphone/PC
const uploadAvatar = async (req, res) => {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Aucun fichier reçu.",
    });
  }

  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "user_avatars",
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Utilisateur non trouvé.",
      });
    }

    user.avatar = result.secure_url;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Avatar uploadé avec succès.",
      avatarUrl: result.secure_url,
      user,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur." });
  }
};
export {
  addFriend,
  removeFriend,
  searchUser,
  selectAvatar,
  updateAvatar,
  uploadAvatar,
};

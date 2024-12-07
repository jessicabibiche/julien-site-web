import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// ajouter un ami
const addFriend = async (req, res) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { friendId } = req.params;
    const userId = decoded.userId;

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
        .json({ message: "Cet utilisateur est déjà votre ami." });
    }

    user.friends.push({ friendId: friend.id, status: "offline" });
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Ami ajouté avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'ami :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de l'ajout de l'ami." });
  }
};

// supprimer un ami
const removeFriend = async (req, res) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { friendId } = req.params;
    const userId = decoded.userId;

    const user = await User.findById(userId);
    user.friends = user.friends.filter(
      (friend) => !friend.friendId.equals(friendId)
    );

    await user.save();

    res.status(StatusCodes.OK).json({ message: "Ami supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression d'ami :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la suppression de l'ami." });
  }
};

// Recherche d'utilisateurs par pseudo et discriminator
const searchUser = async (req, res) => {
  try {
    // Récupérer le token à partir des cookies signés
    const token = req.signedCookies.token;

    // Vérifier que le token est présent
    if (!token) {
      return res
        .status(401)
        .json({ message: "Accès non autorisé. Veuillez vous connecter." });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Token invalide ou expiré. Veuillez vous reconnecter.",
      });
    }

    // Vérifier la requête : pseudo requis
    const { pseudo, discriminator } = req.query;
    if (!pseudo) {
      return res
        .status(400)
        .json({ message: "Le pseudo est requis pour la recherche." });
    }

    // Debug: Affichage des informations de recherche
    console.log(
      "Recherche de l'utilisateur avec pseudo :",
      pseudo,
      "et discriminator :",
      discriminator
    );

    // Créer la requête de recherche avec pseudo (insensible à la casse)
    const query = { pseudo: new RegExp(pseudo, "i") };
    if (discriminator) {
      query.discriminator = discriminator; // Ajouter le discriminateur si présent
    }

    // Effectuer la recherche dans la base de données
    const users = await User.find(query).select(
      "pseudo discriminator avatar status"
    );

    // Vérifier si des utilisateurs ont été trouvés
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    // Réponse en cas de succès
    res.status(200).json(users);
  } catch (error) {
    // Log de l'erreur pour aider à diagnostiquer les problèmes côté serveur
    console.error("Erreur lors de la recherche d'utilisateur :", error);

    // Réponse générique en cas d'erreur serveur
    res.status(500).json({
      message:
        "Erreur serveur lors de la recherche. Veuillez réessayer plus tard.",
    });
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

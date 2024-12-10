import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import Notification from "./Notification.js";
import { ProjectClient } from "magicbell/project-client";

const magicBell = new ProjectClient({
  apiKey: process.env.VITE_MAGICBELL_API_KEY,
  apiSecret: process.env.VITE_MAGICBELL_API_SECRET,
});

// ajouter un ami
const addFriend = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { friendId } = req.params;

    if (userId === friendId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vous ne pouvez pas vous ajouter vous-même." });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé." });
    }

    if (
      friend.pendingFriendRequests.some((req) => req.from.toString() === userId)
    ) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Vous avez déjà envoyé une demande à cet utilisateur.",
      });
    }

    // Ajouter la demande d'ami
    friend.pendingFriendRequests.push({ from: userId });
    await friend.save();

    // Envoyer une notification via MagicBell
    await magicBell.notifications.create({
      title: "Nouvelle demande d'ami",
      content: `${req.user.pseudo} vous a envoyé une demande d'ami.`,
      recipients: [{ external_id: friendId }],
      category: "friend_request",
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Demande d'ami envoyée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'ami :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur interne." });
  }
};

// supprimer un ami
const removeFriend = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { friendId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé." });
    }

    user.friends = user.friends.filter(
      (friend) => !friend.friendId.equals(friendId)
    );
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Ami supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression d'ami :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur interne." });
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

    // Récupérer l'ID de l'utilisateur connecté
    const currentUserId = decoded.userId;

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
    const query = {
      pseudo: new RegExp(pseudo, "i"),
      _id: { $ne: currentUserId },
    };

    if (discriminator) {
      query.discriminator = discriminator;
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
const getFriends = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).populate(
      "friends.friendId",
      "pseudo avatar status lastOnline"
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé." });
    }

    const friends = user.friends.map((friend) => ({
      id: friend.friendId._id,
      pseudo: friend.friendId.pseudo,
      avatar: friend.friendId.avatar,
      status: friend.friendId.status,
      lastOnline: friend.friendId.lastOnline,
    }));

    res.status(StatusCodes.OK).json({ friends });
  } catch (error) {
    console.error("Erreur lors de la récupération des amis :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur interne." });
  }
};

const getNotifications = async (req, res) => {
  try {
    // Récupérer les notifications (exemple simplifié)
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des notifications." });
  }
};
const testNotification = async (req, res) => {
  try {
    const { toUserId, message } = req.body;

    if (!toUserId || !message) {
      return res
        .status(400)
        .json({ message: "toUserId and message are required." });
    }

    console.log("Sending notification to:", toUserId);
    console.log("Message:", message);

    const result = await sendNotification(toUserId, message);

    console.log("Notification result:", result);

    res.status(200).json({ message: "Test notification sent successfully!" });
  } catch (error) {
    console.error("Error sending test notification:", error);
    res
      .status(500)
      .json({ message: "Error occurred while sending test notification." });
  }
};
const getFriendRequests = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Récupérer l'utilisateur et peupler les demandes d'amis
    const user = await User.findById(userId)
      .populate("pendingFriendRequests.from", "pseudo avatar discriminator")
      .exec();

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé." });
    }

    // Log des demandes peuplées pour déboguer
    console.log("Friend requests:", user.pendingFriendRequests);

    // Construire une réponse propre
    const friendRequests = user.pendingFriendRequests.map((request) => ({
      id: request._id,
      pseudo: request.from?.pseudo || "Utilisateur inconnu",
      avatar: request.from?.avatar || "",
      discriminator: request.from?.discriminator || "",
      sentAt: request.sentAt,
    }));

    res.status(StatusCodes.OK).json({ friendRequests });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes d'amis :",
      error
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur interne." });
  }
};

const respondToFriendRequest = async (req, res) => {
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { requestId, action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const requestIndex = user.pendingFriendRequests.findIndex(
      (req) => req._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Demande introuvable." });
    }

    const fromUserId = user.pendingFriendRequests[requestIndex].from;

    if (action === "accept") {
      await user.acceptFriendRequest(requestId);

      // Envoyer une notification
      await magicBell.notifications.create({
        title: "Demande d'ami acceptée",
        content: `${req.user.pseudo} a accepté votre demande d'ami.`,
        recipients: [{ external_id: fromUserId }],
        category: "friend_request_accepted",
      });

      res.status(200).json({ message: "Demande acceptée." });
    } else if (action === "decline") {
      await user.declineFriendRequest(requestId);

      // Envoyer une notification
      await magicBell.notifications.create({
        title: "Demande d'ami refusée",
        content: `${req.user.pseudo} a refusé votre demande d'ami.`,
        recipients: [{ external_id: fromUserId }],
        category: "friend_request_declined",
      });

      res.status(200).json({ message: "Demande refusée." });
    } else {
      res.status(400).json({ message: "Action invalide." });
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la demande :", error);
    res.status(500).json({ message: "Erreur interne." });
  }
};

export {
  addFriend,
  removeFriend,
  searchUser,
  selectAvatar,
  updateAvatar,
  uploadAvatar,
  getFriends,
  testNotification,
  getNotifications,
  getFriendRequests,
  respondToFriendRequest,
};

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
export const searchUser = async (req, res) => {
  const { pseudo, discriminator } = req.query;

  if (!pseudo || !discriminator) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Le pseudo et le discriminateur sont requis" });
  }

  try {
    const user = await User.findOne({ pseudo, discriminator });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    return res.status(StatusCodes.OK).json({
      _id: user._id,
      pseudo: user.pseudo,
      discriminator: user.discriminator,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la recherche de l'utilisateur" });
  }
};

export { addFriend, removeFriend };

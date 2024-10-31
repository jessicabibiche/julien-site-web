import { StatusCodes } from "http-status-codes";
import { createUser, getUser } from "../users/users.service.js";
import { UnauthenticatedError } from "../../errors/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../users/users.model.js";

// Fonction d'inscription
const registerUser = async (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  try {
    const existingUser = await getUser({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Cet email est déjà utilisé" });
    }

    const user = await createUser({ pseudo, email, password });
    const token = user.createAccessToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    res
      .status(StatusCodes.CREATED)
      .json({ user: { pseudo: user.pseudo, email: user.email } });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

// Fonction de connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Veuillez fournir un email et un mot de passe" });
  }

  try {
    const user = await getUser({ email });
    if (!user || !(await user.comparePasswords(password))) {
      throw new UnauthenticatedError("Identifiants invalides");
    }

    const token = user.createAccessToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(StatusCodes.OK).json({
      user: { id: user._id, pseudo: user.pseudo, email: user.email },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Identifiants invalides" });
  }
};

// Fonction de déconnexion
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(StatusCodes.OK).json({ message: "Déconnexion réussie" });
};

// Fonction de réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la réinitialisation du mot de passe",
    });
  }
};

export { loginUser, registerUser, logout, resetPassword };

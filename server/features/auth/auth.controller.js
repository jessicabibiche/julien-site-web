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
      secure: process.env.NODE_ENV === "development",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
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

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Créer un token JWT
    const token = user.createAccessToken();

    // Mettre à jour le statut de l'utilisateur à 'online'
    user.status = "online";
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la connexion" });
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

const checkAuth = (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Pas de token fourni !" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ authenticated: true, user: decodedToken });
  } catch (error) {
    res.status(200).json({ authenticated: false });
  }
};

export { loginUser, registerUser, logout, resetPassword, checkAuth };

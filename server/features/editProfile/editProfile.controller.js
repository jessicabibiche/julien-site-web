import User from "../users/users.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Fonction pour demander une réinitialisation de mot de passe
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Génération d'un token JWT pour la réinitialisation de mot de passe
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lien de réinitialisation
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Envoi de l'email de réinitialisation
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Email de réinitialisation envoyé avec succès" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la demande de réinitialisation de mot de passe",
    });
  }
};

// Fonction pour réinitialiser le mot de passe avec le lien envoyé par email
export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    // Vérifier le token
    const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Mise à jour et sauvegarde du mot de passe haché
    user.password = hashedPassword;
    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Lien de réinitialisation invalide ou expiré" });
  }
};

// Fonction pour mettre à jour le mot de passe de l'utilisateur connecté
export const updateUserPassword = async (req, res) => {
  const { userId } = req.user; // L'utilisateur doit être connecté
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Ancien mot de passe incorrect" });
    }

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
};

// Fonction pour mettre à jour les informations sensibles
export const updateUserSensitiveInfo = async (req, res) => {
  const { userId } = req.user;
  const { pseudo, firstname, lastname, address, phone, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    console.log("Avant modification :", user);

    if (pseudo) user.pseudo = pseudo;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // Mettre à jour le mot de passe uniquement si `newPassword` est fourni
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
      console.log("Mot de passe mis à jour");
    } else {
      console.log("Aucun changement de mot de passe");
    }

    await user.save();

    console.log("Après modification :", user);

    return res.status(StatusCodes.OK).json({
      message: "Informations personnelles mises à jour avec succès",
      user: { pseudo, firstname, lastname, address, phone },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de la mise à jour des informations" });
  }
};

// Fonction pour obtenir le profil de l'utilisateur connecté
export const getUserProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select(
      "pseudo firstname lastname address phone email avatar status"
    );
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la récupération du profil",
    });
  }
};

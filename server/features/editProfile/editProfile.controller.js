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
  const { resetToken } = req.params; // Token reçu par URL
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

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
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
  const { pseudo, firstname, lastname, address, phone } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    if (pseudo) user.pseudo = pseudo;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();

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

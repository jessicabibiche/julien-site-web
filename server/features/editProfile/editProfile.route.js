import express from "express";
import {
  updateUserSensitiveInfo,
  updateUserPassword,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
} from "./editProfile.controller.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Route pour obtenir les informations de l'utilisateur connecté
router.get("/", authenticateUser, getUserProfile);

// Endpoint pour mettre à jour les informations sensibles de l'utilisateur
router.put("/", authenticateUser, updateUserSensitiveInfo);

// Endpoint pour mettre à jour le mot de passe de l'utilisateur connecté
router.put("/password", authenticateUser, updateUserPassword);

// Endpoint pour demander une réinitialisation de mot de passe par email
router.post("/request-password-reset", requestPasswordReset);

// Endpoint pour réinitialiser le mot de passe avec un lien reçu par email
router.post("/reset-password/:resetToken", resetPassword);

export default router;

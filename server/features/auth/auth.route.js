import express from "express";
import validate from "../../middlewares/validations.middlewares.js";
import {
  registerUser,
  loginUser,
  resetPassword,
  logout,
  checkAuth,
} from "./auth.controller.js"; // Assurez-vous que les noms correspondent

import {
  RegisterUserSchema,
  LoginUserSchema,
  ResetPasswordSchema,
} from "../users/users.schema.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Route pour l'inscription
router.post(
  "/register",
  validate({ bodySchema: RegisterUserSchema }),
  registerUser
);

// Route pour la connexion
router.post("/login", validate({ bodySchema: LoginUserSchema }), loginUser);

// Route pour la déconnexion
router.post("/logout", authenticateUser, logout);
router.get("/check-auth", authenticateUser, checkAuth);
export default router;

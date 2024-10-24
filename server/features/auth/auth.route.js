import express from "express";
import validate from "../../middlewares/validations.middlewares.js";
import { RegisterUserSchema, LoginUserSchema } from "../users/users.schema.js";
import * as authController from "./auth.controller.js";
import { requestPasswordReset } from "../profile/profile.controller.js";

const router = express.Router();

router.post(
  "/register",
  validate({ bodySchema: RegisterUserSchema }),
  authController.register
);
router.post(
  "/login",
  validate({ bodySchema: LoginUserSchema }),
  authController.login
);
// Route pour demander une réinitialisation de mot de passe
router.post("/request-password-reset", requestPasswordReset);
export default router;

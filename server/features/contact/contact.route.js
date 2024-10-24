import express from "express";
import { sendContactMessage } from "./contact.controller.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Définir la route pour le contact sans `/contact` supplémentaire
router.post("/", authenticateUser, sendContactMessage);

export default router;

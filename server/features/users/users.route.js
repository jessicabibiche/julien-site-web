import express from "express";
import { addFriend, removeFriend, searchUser } from "./users.controller.js"; // Assure-toi d'avoir ces contrôleurs
import authenticateUser from "../../middlewares/auth.middleware.js"; // Middleware d'authentification

const router = express.Router();

// Route pour ajouter un ami
router.post("/add-friend/:friendId", authenticateUser, addFriend);

// Route pour supprimer un ami
router.delete("/remove-friend/:friendId", authenticateUser, removeFriend);

// Route pour rechercher un utilisateur par pseudo et discriminator
router.get("/search", authenticateUser, searchUser);

export default router;

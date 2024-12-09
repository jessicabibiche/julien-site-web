import express from "express";
import {
  addFriend,
  removeFriend,
  searchUser,
  selectAvatar,
  updateAvatar,
  uploadAvatar,
  getFriends,
} from "./users.controller.js";
import authenticateUser from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Route pour ajouter un ami
router.post("/add-friend/:friendId", authenticateUser, addFriend);

// Route pour supprimer un ami
router.delete("/remove-friend/:friendId", authenticateUser, removeFriend);

// Route pour rechercher un utilisateur par pseudo et discriminator
router.get("/search", authenticateUser, searchUser);

// Route pour mettre à jour un avatar personnalisé
router.put("/update-avatar", authenticateUser, updateAvatar);

// Route pour sélectionner un avatar prédéfini
router.put("/select-avatar", authenticateUser, selectAvatar);

// Route pour récupérer la liste des amis
router.get("/get-friends", authenticateUser, getFriends);

// Route pour uploader un avatar depuis un téléphone/PC
router.post(
  "/upload-avatar",
  authenticateUser,
  upload.single("avatars"),
  uploadAvatar
);

export default router;

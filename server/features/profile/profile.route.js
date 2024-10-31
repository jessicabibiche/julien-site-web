import express from "express";
import { getUserProfile, updateBio } from "./profile.controller.js";
import authenticateUser from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validations.middlewares.js";
import { UpdateBioSchema } from "./profile.schema.js";

const router = express.Router();

// Endpoint pour consulter la bio
router.get("/bio", authenticateUser, getUserProfile);

// Endpoint pour mettre à jour la bio avec validation
router.put(
  "/bio",
  authenticateUser,
  validate({ bodySchema: UpdateBioSchema }),
  updateBio
);

export default router;

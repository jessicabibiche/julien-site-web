import express from "express";
import { getVideos } from "./youtube.controller.js";

const router = express.Router();

// Définir la route pour récupérer les vidéos
router.get("/", getVideos);

export default router;

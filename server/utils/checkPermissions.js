import { checkPermissions } from "../utils/checkPermissions.js";

// Mettre à jour le profil utilisateur
const updateUserProfile = async (req, res) => {
  const { userId } = req.user;
  const { id: ressourceUserId } = req.params;

  // Vérifie que l'utilisateur est autorisé à modifier cette ressource
  checkPermissions(req.user, ressourceUserId);
};

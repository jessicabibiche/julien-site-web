import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const authenticateUser = (req, res, next) => {
  console.log("Vérification des cookies signés :", req.signedCookies);

  const token = req.signedCookies.token;

  if (!token) {
    console.log("Aucun token trouvé");
    throw new UnauthenticatedError(
      "Accès non autorisé. Vous devez être connecté."
    );
  }

  try {
    console.log("Token trouvé :", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    throw new UnauthenticatedError(
      "Token invalide ou expiré. Veuillez vous reconnecter."
    );
  }
};

export default authenticateUser;

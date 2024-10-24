import { StatusCodes } from "http-status-codes";
import { createUser, getUser } from "../users/users.service.js";
import { UnauthenticatedError } from "../../errors/index.js";

// Fonction d'inscription
const register = async (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await getUser({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Cet email est déjà utilisé" });
    }

    // Crée un nouvel utilisateur
    const user = await createUser({ pseudo, email, password });
    const token = user.createAccessToken(); // Génère un token JWT

    res
      .status(StatusCodes.CREATED)
      .json({ user: { pseudo: user.pseudo, email: user.email }, token });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

// Fonction de connexion
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Veuillez fournir un email et un mot de passe" });
  }

  try {
    const user = await getUser({ email });
    if (!user || !(await user.comparePasswords(password))) {
      throw new UnauthenticatedError("Identifiants invalides");
    }

    const token = user.createAccessToken();

    res.status(StatusCodes.OK).json({
      user: { id: user._id, pseudo: user.pseudo, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Identifiants invalides" });
  }
};

export { login, register };

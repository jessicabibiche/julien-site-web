import sendEmail from "../utils/sendEmail.js";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

// Limiter la fréquence d'envoi à 5 demandes toutes les 15 minutes
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite chaque IP à 5 requêtes par fenêtre
  message: "Trop de demandes de contact, veuillez réessayer plus tard.",
});

// Fonction d'envoi du message de contact
const sendContactMessage = async (req, res) => {
  const token = req.signedCookies?.token;

  // Vérification du token
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Vous devez être connecté." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Utilisateur authentifié :", decoded);

    const { pseudo, email, message } = req.body;

    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Utiliser sendEmail pour envoyer le message au streamer
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Nouveau message de contact de ${pseudo}`,
      text: `Pseudo: ${pseudo}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Impossible d'envoyer le message" });
  }
};

// Validation des entrées utilisateur
const validateContactInputs = [
  body("pseudo").notEmpty().withMessage("Pseudo est obligatoire."),
  body("email").isEmail().withMessage("Veuillez fournir un email valide."),
  body("message").notEmpty().withMessage("Message est obligatoire."),
];

export { sendContactMessage, validateContactInputs, contactRateLimiter };

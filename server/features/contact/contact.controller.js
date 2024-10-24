import sendEmail from "../utils/sendEmail.js";

const sendContactMessage = async (req, res) => {
  const { pseudo, email, message } = req.body;

  if (!pseudo || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  try {
    // Utiliser sendEmail pour envoyer le message au streamer
    await sendEmail({
      to: "assistance.kodeldragon@gmail.com",
      subject: `Nouveau message de contact de ${pseudo}`,
      text: `Pseudo: ${pseudo}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Impossible d'envoyer le message" });
  }
};

export { sendContactMessage };

import axios from "axios";

export const sendMagicBellNotification = async (toUserId, message) => {
  try {
    console.log("Tentative d'envoi via MagicBell...");

    const payload = {
      notification: {
        title: "Nouvelle demande d'ami",
        content: message,
        recipients: [
          {
            external_id: toUserId,
          },
        ],
      },
    };

    console.log("Payload envoyé à MagicBell :", payload);

    const response = await axios.post(
      "https://api.magicbell.com/notifications",
      payload,
      {
        headers: {
          "X-MAGICBELL-API-KEY": process.env.VITE_MAGICBELL_API_KEY,
          "X-MAGICBELL-API-SECRET": process.env.VITE_MAGICBELL_API_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Réponse de MagicBell :", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi MagicBell :",
      error.response?.data || error.message
    );
    throw error;
  }
};

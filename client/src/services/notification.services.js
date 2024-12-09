import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${baseUrl}/notifications`, {
      withCredentials: true,
    });
    return response.data.notifications;
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};

// Fonction pour envoyer une notification via MagicBell (optionnel, si vous voulez tester)
export const sendNotification = async (toUserId, message) => {
  try {
    const response = await axios.post(
      `${baseUrl}/users/test-notification`,
      { toUserId, message },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
    throw error;
  }
};

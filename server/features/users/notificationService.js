import Notification from "./Notification.js"; // Chemin relatif depuis `users`

export const createNotification = async (userId, content, type = "general") => {
  try {
    const notification = new Notification({
      userId,
      content,
      type,
    });
    await notification.save(); // Enregistrer la notification dans MongoDB
    console.log(`Notification envoyée à l'utilisateur ${userId}: ${content}`);
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
  }
};

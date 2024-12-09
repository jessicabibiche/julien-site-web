import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Destinataire
  content: { type: String, required: true }, // Contenu de la notification
  type: {
    type: String,
    enum: ["friend_request", "general"],
    default: "general",
  }, // Type de notification
  isRead: { type: Boolean, default: false }, // Si la notification a été lue
  createdAt: { type: Date, default: Date.now }, // Date de création
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

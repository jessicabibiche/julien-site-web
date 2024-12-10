import http from "http";
import { Server } from "socket.io";
import app from "./app.js"; // Importer votre app.js
import User from "./features/users/users.model.js"; // Importer le modèle utilisateur

// Créer un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Configurer Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adresse de votre frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Gérer les connexions Socket.IO
io.on("connection", (socket) => {
  console.log(`Utilisateur connecté avec l'ID : ${socket.id}`);

  // Gérer l'événement "userOnline"
  socket.on("userOnline", async (userId) => {
    try {
      console.log(`Utilisateur ${userId} est en ligne.`);

      // Associer l'utilisateur au socket pour un suivi futur
      socket.userId = userId;

      // Mettre à jour le statut de l'utilisateur dans la base de données
      const user = await User.findByIdAndUpdate(
        userId,
        { status: "online" },
        { new: true } // Renvoyer le document mis à jour
      ).populate("friends.friendId", "pseudo avatar status");

      if (!user) {
        console.error("Utilisateur introuvable lors de la connexion.");
        return;
      }

      // Notifier uniquement les amis de cet utilisateur
      user.friends.forEach((friend) => {
        const friendId = friend.friendId._id.toString();
        io.to(friendId).emit("userStatusUpdate", {
          userId,
          status: "online",
        });
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut utilisateur :",
        error
      );
    }
  });

  /**
   * Ajout des événements pour les demandes et réponses d'amis
   */

  // Lorsqu'une demande d'ami est envoyée
  socket.on("friendRequestSent", async (data) => {
    try {
      console.log(
        `Nouvelle demande d'ami envoyée de ${data.fromUserId} à ${data.toUserId}`
      );

      // Notifier l'utilisateur cible de la demande d'ami
      io.to(data.toUserId).emit("newFriendRequest", {
        fromUserId: data.fromUserId,
        pseudo: data.pseudo, // Nom du demandeur
        avatar: data.avatar, // Avatar du demandeur
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de la demande d'ami via Socket.IO :",
        error
      );
    }
  });

  // Lorsqu'une demande d'ami est acceptée ou refusée
  socket.on("friendRequestResponse", async (data) => {
    try {
      console.log(
        `Réponse à la demande d'ami de ${data.fromUserId}: ${data.action}`
      );

      // Notifier l'utilisateur qui a envoyé la demande initiale
      io.to(data.fromUserId).emit("friendRequestUpdated", {
        action: data.action, // "accept" ou "decline"
        pseudo: data.pseudo, // Nom de l'utilisateur cible
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de la réponse à la demande d'ami via Socket.IO :",
        error
      );
    }
  });

  // Gérer la déconnexion de l'utilisateur
  socket.on("disconnect", async () => {
    console.log(`Utilisateur déconnecté : ${socket.id}`);

    const userId = socket.userId; // Récupérer l'userId associé au socket

    if (userId) {
      try {
        // Mettre à jour le statut de l'utilisateur dans la base de données
        const user = await User.findByIdAndUpdate(
          userId,
          { status: "offline", lastOnline: new Date() },
          { new: true }
        ).populate("friends.friendId", "pseudo avatar status");

        if (!user) {
          console.error("Utilisateur introuvable lors de la déconnexion.");
          return;
        }

        // Notifier uniquement les amis de cet utilisateur
        user.friends.forEach((friend) => {
          const friendId = friend.friendId._id.toString();
          io.to(friendId).emit("userStatusUpdate", {
            userId,
            status: "offline",
            lastOnline: user.lastOnline,
          });
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du statut lors de la déconnexion :",
          error
        );
      }
    }
  });
});

// Lancer le serveur avec le port défini dans ce fichier
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `Serveur WebSocket en cours d'exécution sur http://localhost:${port}/`
  );
});

export default server;

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
      await User.findByIdAndUpdate(userId, { status: "online" });

      // Notifier tous les autres utilisateurs que cet utilisateur est en ligne
      socket.broadcast.emit("userStatusUpdate", { userId, status: "online" });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut utilisateur :",
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
        await User.findByIdAndUpdate(userId, { status: "offline" });

        // Notifier tous les autres utilisateurs que cet utilisateur est hors ligne
        socket.broadcast.emit("userStatusUpdate", {
          userId,
          status: "offline",
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

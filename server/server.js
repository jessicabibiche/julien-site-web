// Importation de l'application Express configurée
import app from "./app.js";
import { Server } from "socket.io"; // Importation de Socket.IO
import http from "http"; // Nécessaire pour créer le serveur HTTP
import User from "./features/users/users.model.js"; // Importation du modèle utilisateur (adapte le chemin si nécessaire)

// Créer un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Configurer Socket.IO sur ce serveur
const io = new Server(server, { cors: { origin: "*" } });

// Gérer la connexion des utilisateurs avec Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  // Gérer l'événement "userOnline" émis par le client
  socket.on("userOnline", async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { status: "online" });
      io.emit("userStatusUpdate", { userId, status: "online" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l’état :", error);
    }
  });

  // Gérer la déconnexion de l'utilisateur
  socket.on("disconnect", async () => {
    console.log("Un utilisateur s’est déconnecté");
    const userId = socket.userId; // Assurez-vous d'avoir associé un userId avec chaque socket
    if (userId) {
      await User.findByIdAndUpdate(userId, { status: "offline" });
      io.emit("userStatusUpdate", { userId, status: "offline" });
    }
  });
});

// Définition du port et démarrage du serveur
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

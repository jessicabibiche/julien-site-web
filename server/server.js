import app from "./app.js";
import { Server } from "socket.io";
import http from "http";
import User from "./features/users/users.model.js";

// Créer un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Configurer Socket.IO sur ce serveur
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Utiliser l'URL de ton front-end (localhost:5173 par exemple)
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Gérer la connexion des utilisateurs avec Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  // Gérer l'événement "userOnline" émis par le client
  socket.on("userOnline", async (userId) => {
    try {
      // Associer l'userId avec le socket (pour pouvoir l'utiliser à la déconnexion)
      socket.userId = userId;

      // Mettre à jour le statut de l'utilisateur
      await User.findByIdAndUpdate(userId, { status: "online" });

      // Récupérer la liste des amis de l'utilisateur
      const user = await User.findById(userId).populate("friends"); // Assure-toi d'avoir une relation "friends" dans ton modèle User

      // Informer uniquement les amis que l'utilisateur est en ligne
      user.friends.forEach((friend) => {
        io.to(friend._id.toString()).emit("userStatusUpdate", {
          userId,
          status: "online",
        });
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l’état :", error);
    }
  });

  // Gérer la déconnexion de l'utilisateur
  socket.on("disconnect", async () => {
    console.log("Un utilisateur s’est déconnecté");

    // Récupérer l'userId précédemment associé au socket
    const userId = socket.userId;

    // Si on a un userId, on peut mettre à jour son statut
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, { status: "offline" });

        // Récupérer la liste des amis de l'utilisateur
        const user = await User.findById(userId).populate("friends");

        // Informer uniquement les amis que l'utilisateur est hors ligne
        user.friends.forEach((friend) => {
          io.to(friend._id.toString()).emit("userStatusUpdate", {
            userId,
            status: "offline",
          });
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l’état lors de la déconnexion :",
          error
        );
      }
    }
  });
});

// Définition du port et démarrage du serveur
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

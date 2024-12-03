import { io } from "socket.io-client";

console.log(
  "Connecting to WebSocket at:",
  import.meta.env.VITE_API_URL.replace("/api/v1", "")
);

const token = localStorage.getItem("token");

const socket = io(import.meta.env.VITE_API_URL.replace("/api/v1", ""), {
  withCredentials: true,
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"), // Envoie le token lors de la connexion
  },
});

// Événements de débogage pour la connexion
socket.on("connect", () => {
  console.log("Connecté au serveur WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("Erreur de connexion WebSocket :", err);
  console.log("Tentative de reconnexion...");
  setTimeout(() => socket.connect(), 5000); // Reconnexion après 5 secondes
});

socket.on("disconnect", () => {
  console.log("Déconnecté du serveur WebSocket");
});

// Exemple d'écoute des événements spécifiques
socket.on("userOnline", (user) => {
  console.log("Utilisateur en ligne :", user);
});

socket.on("message", (message) => {
  console.log("Nouveau message :", message);
});

export default socket;

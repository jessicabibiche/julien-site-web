import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api/v1", ""));

// Exporter la connexion socket pour l'utiliser partout
export default socket;

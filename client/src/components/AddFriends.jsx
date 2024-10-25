import React, { useState, useEffect } from "react";
import { searchUser, addFriend } from "../services/user.services";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api/v1", ""));

const AddFriend = () => {
  const [message, setMessage] = useState("");
  const [searchPseudo, setSearchPseudo] = useState("");
  const [searchDiscriminator, setSearchDiscriminator] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState("");
  const [friendStatus, setFriendStatus] = useState("");

  // Écoute les mises à jour du statut d'amis via Socket.IO
  useEffect(() => {
    socket.on("userStatusUpdate", (data) => {
      if (userFound && userFound._id === data.userId) {
        setFriendStatus(data.status);
      }
    });

    // Nettoyage de la connexion Socket.IO lorsqu'on quitte le composant
    return () => {
      socket.off("userStatusUpdate");
    };
  }, [userFound]);

  const handleSearch = async () => {
    if (!searchPseudo || !searchDiscriminator) {
      setError("Veuillez entrer un pseudo et un discriminateur");
      return;
    }

    try {
      const result = await searchUser(searchPseudo, searchDiscriminator);
      if (result.length > 0) {
        setUserFound(result[0]); // Suppose qu'il y a au moins un résultat
        setFriendStatus(result[0].status); // Mise à jour du statut de l'utilisateur
        setError(""); // Réinitialise les erreurs
      } else {
        setError("Utilisateur non trouvé.");
        setUserFound(null);
      }
    } catch (err) {
      setError("Erreur lors de la recherche de l'utilisateur.");
      setUserFound(null); // Réinitialise les résultats en cas d'erreur
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(friendId);
      setMessage("Ami ajouté avec succès");
    } catch (err) {
      setMessage("Erreur lors de l'ajout de l'ami.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-md">
      <h2 className="text-3xl font-bold mb-6">Ajouter un ami</h2>

      {/* Champ de recherche */}
      <input
        className="w-full p-2 rounded"
        type="text"
        value={searchPseudo}
        onChange={(e) => setSearchPseudo(e.target.value)}
        placeholder="Pseudo"
      />
      <input
        className="w-full p-2 rounded mt-2"
        type="text"
        value={searchDiscriminator}
        onChange={(e) => setSearchDiscriminator(e.target.value)}
        placeholder="Discriminator (ex: 1245)"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 w-full p-2 mt-4 rounded hover:bg-blue-400"
      >
        Rechercher
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {userFound && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <div className="flex items-center space-x-4">
            <div>
              <p>
                {userFound.pseudo}#{userFound.discriminator}
              </p>
              <p
                className={`text-sm ${
                  friendStatus === "online" ? "text-green-500" : "text-gray-400"
                }`}
              >
                {friendStatus === "online" ? "En ligne" : "Hors ligne"}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAddFriend(userFound._id)}
            className="bg-green-500 w-full p-2 mt-4 rounded hover:bg-green-400"
          >
            Ajouter en ami
          </button>
        </div>
      )}

      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default AddFriend;

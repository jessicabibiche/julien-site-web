import React, { useState } from "react";
import { io } from "socket.io-client";
import { searchUser, addFriend } from "../services/user.services";

// Connexion au serveur Socket.io
const socket = io(import.meta.env.VITE_SOCKET_URL);

const AddFriend = ({ friendId }) => {
  const [message, setMessage] = useState("");
  const [searchPseudo, setSearchPseudo] = useState("");
  const [searchDiscriminator, setSearchDiscriminator] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const result = await searchUser(searchPseudo, searchDiscriminator);
      setUserFound(result);
      setError(""); // Réinitialise les erreurs
    } catch (err) {
      setError("Utilisateur non trouvé.");
      setUserFound(null); // Réinitialise les résultats en cas d'erreur
    }
  };

  const handleAddFriend = async () => {
    try {
      await addFriend(friendId);
      socket.emit("ajout_ami", { friendId }); // Notifier le serveur
      setMessage("Ami ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ami", error);
      setMessage("Erreur lors de l'ajout de l'ami");
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
          <p>
            {userFound.pseudo}#{userFound.discriminator}
          </p>
          <button
            onClick={() => handleAddFriend(userFound._id)}
            className="bg-green-500 p-2 rounded"
          >
            Ajouter en ami
          </button>
        </div>
      )}
      <div>
        {message && <p className="text-green-500">{message}</p>}
        <button
          onClick={handleAddFriend}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Ajouter comme ami
        </button>
      </div>
    </div>
  );
};

export default AddFriend;

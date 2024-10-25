import React, { useState, useEffect } from "react";
import { searchUser, addFriend } from "../services/user.services"; // Importe les fonctions correspondantes

const SearchFriends = () => {
  const [pseudo, setPseudo] = useState("");
  const [discriminator, setDiscriminator] = useState(""); // Ex. #1234
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Recherche d'utilisateur dès que pseudo est modifié, avec un délai pour éviter trop de requêtes
    const timer = setTimeout(() => {
      if (pseudo && discriminator) {
        handleSearch();
      }
    }, 500); // Délai de 500 ms

    return () => clearTimeout(timer); // Cleanup
  }, [pseudo, discriminator]);

  // Fonction pour effectuer la recherche d'utilisateur
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!pseudo || !discriminator) {
      setError("Veuillez remplir le pseudo et le discriminateur.");
      return;
    }

    try {
      const users = await searchUser(pseudo, discriminator);
      setSearchResults(users);
      setError("");
    } catch (err) {
      setError("Aucun utilisateur trouvé.");
    }
  };

  // Fonction pour ajouter un ami
  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(friendId);
      alert("Ami ajouté avec succès !");
    } catch (err) {
      alert("Erreur lors de l'ajout de l'ami.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-md">
      <h2 className="text-3xl font-bold mb-6">Recherche d'utilisateurs</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          className="w-full p-2 rounded"
          required
        />
        <input
          type="text"
          value={discriminator}
          onChange={(e) => setDiscriminator(e.target.value)}
          placeholder="Discriminator (#1234)"
          className="w-full p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 w-full p-2 rounded">
          Rechercher
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6">
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((user) => (
              <li key={user._id} className="mb-4 bg-gray-700 p-4 rounded">
                <p>
                  Pseudo : {user.pseudo}#{user.discriminator}
                </p>
                <button
                  className="bg-green-500 p-2 rounded mt-2"
                  onClick={() => handleAddFriend(user._id)}
                >
                  Ajouter en ami
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;

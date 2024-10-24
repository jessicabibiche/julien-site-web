import React, { useState, useEffect } from "react";
import { getAllUsers, addFriend } from "../services/user.services";

const AddFriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    };
    fetchUsers();
  }, []);
  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(friendId);
      setMessage("Ami ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ami", error);
      setMessage("Erreur lors de l'ajout de l'ami");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-900 rounded-md shadow-lg neon-box">
      <h2 className="text-3xl font-bold mb-6 text-white neon-text">
        Ajouter des amis
      </h2>
      {message && <p className="text-green-500">{message}</p>}

      {/* Liste des utilisateurs pour ajouter des amis */}
      <ul>
        {users.map((user) => (
          <li key={user._id} className="mb-4">
            {user.pseudo}
            <button
              onClick={() => handleAddFriend(user._id)}
              className="bg-blue-500 text-white p-2 rounded ml-4"
            >
              Ajouter comme ami
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFriendsPage;

import React, { useState, useEffect } from "react";
import {
  getFriendRequests,
  respondToFriendRequest,
} from "../services/user.services";

const Notifications = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const data = await getFriendRequests();
        setFriendRequests(data); // Les demandes d'ami
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes :", error);
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleResponse = async (requestId, action) => {
    try {
      await respondToFriendRequest(requestId, action); // Action : "accept" ou "decline"
      alert(`Demande ${action === "accept" ? "acceptée" : "refusée"}`);
      setFriendRequests(friendRequests.filter((req) => req._id !== requestId)); // Met à jour l'état
    } catch (error) {
      console.error("Erreur lors du traitement de la demande :", error);
    }
  };

  if (loading) {
    return <p>Chargement des demandes...</p>;
  }

  return (
    <div className="notifications-container">
      <h2>Demandes d'ami</h2>
      {friendRequests.length === 0 ? (
        <p>Aucune demande pour le moment.</p>
      ) : (
        <ul>
          {friendRequests.map((request) => (
            <li key={request._id} className="notification-item">
              <p>{`${request.from.pseudo} vous a envoyé une demande.`}</p>
              <button onClick={() => handleResponse(request._id, "accept")}>
                Accepter
              </button>
              <button onClick={() => handleResponse(request._id, "decline")}>
                Refuser
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

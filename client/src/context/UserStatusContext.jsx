import React, { createContext, useState, useEffect } from "react";
import moment from "moment";

// Crée le Contexte pour le Statut Utilisateur
const UserStatusContext = createContext();

// Fournisseur du Statut
const UserStatusProvider = ({ children }) => {
  const [status, setStatus] = useState("offline");
  const [lastOnline, setLastOnline] = useState(null);

  // Fonctionnalité pour gérer le statut en ligne/hors ligne
  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      setLastOnline(null);
    };
    const handleOffline = () => {
      setStatus("offline");
      setLastOnline(moment().toISOString());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Mettre à jour `lastOnline` quand l'utilisateur se déconnecte ou change son statut
  useEffect(() => {
    if (status === "offline" || status === "busy") {
      setLastOnline(moment().toISOString());
    }
  }, [status]);

  return (
    <UserStatusContext.Provider value={{ status, setStatus, lastOnline }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export { UserStatusProvider, UserStatusContext };

import React, { useState } from "react";
import { login } from "../services/auth.services";
import { useNavigate } from "react-router-dom";

const Connexion = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction appelée lorsque le formulaire est soumis
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password); // Appelle le service d'authentification
      localStorage.setItem("token", data.token); // Stocke le token JWT
      setIsAuthenticated(true);
      navigate("/"); // Redirige après la connexion
    } catch (err) {
      setError(err.message); // Gère les erreurs
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-md">
      <h2 className="text-3xl font-bold mb-6">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {" "}
        {/* Lorsque l'utilisateur soumet le formulaire, handleSubmit est appelé */}
        <input
          className="w-full p-2 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full p-2 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Affiche l'erreur s'il y en a */}
        <button
          type="submit"
          className="bg-yellow-500 w-full p-2 rounded hover:bg-yellow-400"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Connexion;

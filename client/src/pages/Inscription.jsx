import React, { useState } from "react";
import { register } from "../services/auth.services";
import { useNavigate } from "react-router-dom";

const Inscription = ({ setIsAuthenticated }) => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(pseudo, email, password); // Appelle le service d'inscription
      localStorage.setItem("token", data.token); // Stocke le token JWT
      setIsAuthenticated(true);
      navigate("/"); // Redirige après l'inscription
    } catch (err) {
      setError(err.message); // Gère les erreurs
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-md">
      <h2 className="text-3xl font-bold mb-6">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded"
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          required
        />
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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-yellow-500 w-full p-2 rounded hover:bg-yellow-400"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;

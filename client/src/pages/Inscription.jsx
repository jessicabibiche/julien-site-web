import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.services";

const Inscription = ({ setIsAuthenticated }) => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fonction de soumission du formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Utilise la fonction `register` de `services/auth.services`
      const response = await register(pseudo, email, password);

      // Une fois l'inscription réussie, enregistre le token et mets à jour l'état
      const token = response.token; // Assure-toi que ton backend renvoie un token après l'inscription
      if (token) {
        localStorage.setItem("token", token);
      }

      // L'utilisateur est maintenant authentifié
      setIsAuthenticated(true);

      // Redirection vers la page d'accueil
      navigate("/");
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8">
      <div className="relative w-full max-w-lg p-10 bg-gray-800 rounded-3xl shadow-lg transform transition-all duration-1000 slide-in-appear neon-border-3d">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text animated-gradient-title mb-8">
          Inscription
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Pseudo */}
          <input
            className="w-full p-4 text-lg bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Pseudo"
            required
          />

          {/* Champ Email */}
          <input
            className="w-full p-4 text-lg bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          {/* Champ Mot de Passe */}
          <div className="relative">
            <input
              className="w-full p-4 text-lg bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-white focus:outline-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Affichage des erreurs */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Bouton d'inscription */}
          <button
            type="submit"
            className="w-full p-4 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg transition-transform transform duration-500 neon-button"
          >
            S'inscrire
          </button>
        </form>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .slide-in-appear {
          animation: slideInAppear 1s ease forwards;
        }

        @keyframes slideInAppear {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .neon-border-3d {
          box-shadow: 0 4px 10px rgba(255, 215, 0, 0.5),
            0 6px 15px rgba(255, 180, 0, 0.3), 0 8px 20px rgba(255, 150, 0, 0.2);
        }

        .neon-button {
          background: linear-gradient(90deg, #ffd700, #ffc700, #ffd700);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.7),
            0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.5);
          transition: all 0.4s ease;
        }

        .neon-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.8),
            0 0 25px rgba(255, 215, 0, 0.7), 0 0 35px rgba(255, 215, 0, 0.6);
        }

        .animated-gradient-title {
          background-image: linear-gradient(90deg, #ffd700, #ff9500, #ffd700);
          background-size: 200% 200%;
          animation: gradientShift 6s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Inscription;

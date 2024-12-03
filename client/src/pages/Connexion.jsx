import React, { useState } from "react";
import { login } from "../services/auth.services";
import { useNavigate } from "react-router-dom";

const Connexion = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const token = response.token; // Vérifie que le token existe ici
      console.log("Token reçu après connexion :", token);
      if (token) {
        localStorage.setItem("token", token);
      }
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8">
      <div className="relative w-full max-w-lg p-10 bg-gray-800 rounded-3xl shadow-lg transform transition-all duration-1000 rotate-in neon-border-3d">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text animated-gradient-title mb-8">
          Connexion
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full p-4 text-lg bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div className="relative">
            <input
              className="w-full p-4 text-lg bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-white"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full p-4 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-lg transition-transform transform duration-500 neon-button"
          >
            Se connecter
          </button>
        </form>
      </div>

      {/* Custom CSS */}
      <style>{`
        .rotate-in {
          animation: rotateIn 1s ease forwards;
          opacity: 0;
          transform: rotateX(-90deg);
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotateX(-90deg) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: rotateX(0) translateY(0);
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

export default Connexion;

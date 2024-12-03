import React, { useState } from "react";
import { MdClose } from "react-icons/md";

function Contact() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pseudo || !email || !message) {
      setErrorMessage("Tous les champs sont obligatoires");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Vous devez être connecté pour envoyer un message");
        return;
      }

      const response = await fetch("http://localhost:5000/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pseudo, email, message }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setPseudo("");
      setEmail("");
      setMessage("");
      setErrorMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setErrorMessage("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 p-8">
      {(successMessage || errorMessage) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className={`${
              successMessage ? "modal-success" : "modal-error"
            } text-white p-8 rounded-xl shadow-2xl max-w-md w-full relative animate-neon-flicker`}
          >
            <MdClose
              className="absolute top-3 right-3 cursor-pointer text-white text-2xl"
              onClick={() => {
                setSuccessMessage("");
                setErrorMessage("");
              }}
            />
            <p className="text-center font-bold text-xl neon-effect">
              {successMessage || errorMessage}
            </p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-lg p-10 rounded-3xl bg-gradient-to-b from-gray-800 to-black shadow-2xl transform transition-all duration-1000 neon-border-3d hover:scale-effect">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text animated-gradient-title neon-title mb-8">
          Contactez-nous
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            type="text"
            placeholder="Votre pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            placeholder="Votre message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button className="w-full p-3 rounded-lg bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-400 neon-button">
            Envoyer
          </button>
        </form>
      </div>

      <style>{`
        /* Dégradé animé pour le titre */
        .animated-gradient-title {
          background-image: linear-gradient(270deg, #ffd700, #ffc700, #ffd700);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Effet néon lumineux pour le titre */
        .neon-title {
          color: #ffd700;
          text-shadow: 0 0 8px #ffd700, 0 0 12px #ffd700, 0 0 16px #ffaa00;
          animation: neon-glow 2s ease-in-out infinite alternate;
        }

        @keyframes neon-glow {
          from {
            text-shadow: 0 0 12px #ffd700, 0 0 18px #ffd700, 0 0 24px #ffaa00;
          }
          to {
            text-shadow: 0 0 20px #ffd700, 0 0 25px #ffd700, 0 0 30px #ffaa00;
          }
        }

        /* Effet néon 3D pour l'encadré principal */
        .neon-border-3d {
          box-shadow: 0 4px 10px rgba(255, 215, 0, 0.5),
            0 6px 15px rgba(255, 180, 0, 0.3), 0 8px 20px rgba(255, 150, 0, 0.2);
        }

        /* Animation pour un léger zoom au survol */
        .hover\\:scale-effect:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease-in-out;
        }

        /* Styles de la modal de succès et d'erreur */
        .modal-success {
          background-color: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff00;
        }

        .modal-error {
          background-color: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff0000;
        }

        /* Animation scintillante pour le message */
        .animate-neon-flicker {
          animation: neon-flicker 1.5s infinite alternate;
        }

        @keyframes neon-flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Animation néon pour le bouton */
        .neon-button {
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5),
            0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2);
          animation: buttonGlow 3s ease-in-out infinite alternate;
        }

        @keyframes buttonGlow {
          from {
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5),
              0 0 20px rgba(255, 215, 0, 0.3);
          }
          to {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8),
              0 0 30px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
}

export default Contact;

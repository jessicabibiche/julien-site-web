import React, { useState, useEffect } from "react";
import axios from "axios";
import { requestPasswordReset } from "../services/user.services.js";
import { FaEdit } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    pseudo: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    resetEmail: "",
  });
  const [initialData, setInitialData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/edit-profile`,
          { withCredentials: true }
        );
        const { pseudo, firstname, lastname, address, phone } = response.data;
        setFormData({ pseudo, firstname, lastname, address, phone });
        setInitialData({ pseudo, firstname, lastname, address, phone });
      } catch (err) {
        setErrorMessage("Impossible de charger les informations de profil.");
      }
    };
    fetchUserProfile();
    setTimeout(() => setFormVisible(true), 300);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const hasChanges = Object.keys(initialData).some(
      (key) => initialData[key] !== formData[key]
    );

    if (hasChanges) {
      try {
        const { pseudo, firstname, lastname, address, phone } = formData;
        await axios.put(
          `${import.meta.env.VITE_API_URL}/edit-profile`,
          { pseudo, firstname, lastname, address, phone },
          { withCredentials: true }
        );
        setSuccessMessage("Profil mis à jour avec succès !");
        setInitialData(formData);
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setErrorMessage("Erreur lors de la mise à jour du profil.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handlePasswordResetRequest = async () => {
    try {
      if (formData.resetEmail) {
        await requestPasswordReset(formData.resetEmail);
        setSuccessMessage(
          "Email envoyé avec succès ! Veuillez consulter vos emails."
        );
      } else {
        setErrorMessage("Veuillez entrer un email pour la réinitialisation.");
      }
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(
        "Erreur lors de la demande de réinitialisation de mot de passe."
      );
      setTimeout(() => setErrorMessage(""), 3000);
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

      <div
        className={`relative w-full max-w-5xl p-16 rounded-3xl bg-gradient-to-b from-gray-800 to-black shadow-2xl transform transition-all duration-1000 ${
          formVisible ? "slide-in-center" : "opacity-0"
        } hover:scale-effect neon-border-3d`}
      >
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text animated-gradient-title neon-title mb-12">
          Modifier le Profil
        </h2>

        <form
          onBlur={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { name: "pseudo", label: "Pseudo" },
            { name: "firstname", label: "Prénom" },
            { name: "lastname", label: "Nom" },
            { name: "address", label: "Adresse" },
            { name: "phone", label: "Numéro de téléphone" },
            { name: "resetEmail", label: "Email pour réinitialisation" },
          ].map(({ name, label }, index) => (
            <div
              key={index}
              className={`relative ${
                focusedField === name ? "neon-background-effect" : ""
              }`}
            >
              <label className="block text-sm font-semibold mb-1 text-gray-300">
                {label}
              </label>
              <div className="flex items-center bg-gray-800 rounded-lg shadow-md transition duration-300">
                <input
                  type={name === "resetEmail" ? "email" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField("")}
                  placeholder={
                    name === "resetEmail" ? "Entrez votre email" : ""
                  }
                  className={`w-full p-3 rounded-l-lg bg-gray-800 text-white focus:outline-none ${
                    focusedField === name ? "border border-yellow-400" : ""
                  }`}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (name === "resetEmail") {
                      handlePasswordResetRequest();
                    } else {
                      document.getElementsByName(name)[0].focus();
                    }
                  }}
                  className={`p-3 rounded-r-lg bg-gray-800 flex items-center justify-center ${
                    focusedField === name ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))}
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

        /* Animation Slide-In pour centrer le formulaire */
        .slide-in-center {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: slideIn 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes slideIn {
          0% {
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Hover effet pour un léger zoom */
        .hover:scale-effect:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease-in-out;
        }

        /* Effet lumineux intense en arrière-plan sous le champ actif */
        .neon-background-effect {
          position: relative;
        }

        .neon-background-effect::before {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 12px;
          background: radial-gradient(
            circle,
            rgba(255, 215, 0, 0.9),
            transparent
          );
          opacity: 1;
          filter: blur(8px);
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "/avatars/avatardefault.png";
import { FaGamepad } from "react-icons/fa";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userAvatar,
  userPseudo,
}) {
  const [langue, setLangue] = useState("français");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [userStatus, setUserStatus] = useState("offline"); // État de l'utilisateur : "online", "busy", "offline"
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLangue = localStorage.getItem("langue");
    if (savedLangue) {
      setLangue(savedLangue);
    }

    // Fermer le menu déroulant quand on clique en dehors
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("Vous êtes déconnecté");
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleStatusChange = (status) => {
    setUserStatus(status);
    setShowStatusDropdown(false); // Ferme le sous-menu après avoir choisi un statut
  };

  return (
    <nav className="relative bg-black p-4 shadow-lg flex justify-between items-center rounded-lg">
      <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
        KOD_ELDRAGON
      </div>

      <div className="flex items-center space-x-6">
        {/* Liens de navigation */}
        {[
          { label: "Accueil", path: "/" },
          { label: "Vidéos", path: "/videos" },
          { label: "À Propos", path: "/apropos" },
          { label: "Jeux", path: "/jeux" },
          { label: "Contact", path: "/contact" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="text-lg text-white font-semibold px-4 py-2 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-400 hover:to-blue-500"
          >
            {item.label}
          </Link>
        ))}

        {/* Bouton de soutien */}
        <Link
          to="/donations"
          className="text-lg font-semibold px-4 py-2 transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full hover:shadow-lg flex items-center space-x-2"
        >
          <FaGamepad className="text-white" /> <span>Soutenir</span>
        </Link>

        {/* Menu Avatar */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-4 py-2"
            >
              {/* Avatar avec indicateur de statut */}
              <div className="relative w-10 h-10 rounded-full border-4 neon-border-violet">
                <img
                  src={userAvatar || defaultAvatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Indicateur d'état en ligne */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    userStatus === "online"
                      ? "bg-green-500"
                      : userStatus === "busy"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                ></span>
              </div>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg py-2 z-20">
                {/* Option pour changer le statut en ligne */}
                <button
                  onClick={() => setShowStatusDropdown((prev) => !prev)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center justify-between"
                >
                  État en ligne
                  <span className="text-sm text-gray-400">
                    {userStatus === "online"
                      ? "En ligne"
                      : userStatus === "busy"
                      ? "Occupé"
                      : "Hors ligne"}
                  </span>
                </button>
                {showStatusDropdown && (
                  <div className="ml-4 mt-2">
                    <button
                      onClick={() => handleStatusChange("online")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      <span className="text-green-500">●</span> En ligne
                    </button>
                    <button
                      onClick={() => handleStatusChange("busy")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      <span className="text-yellow-500">●</span> Occupé
                    </button>
                    <button
                      onClick={() => handleStatusChange("offline")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      <span className="text-gray-400">●</span> Apparaître hors
                      ligne
                    </button>
                  </div>
                )}

                {/* Accéder au profil utilisateur */}
                <Link
                  to="/profil"
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Mon profil utilisateur
                </Link>

                {/* Déconnexion */}
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-500"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

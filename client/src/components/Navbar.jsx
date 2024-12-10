import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGamepad, FaGlobe } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import defaultAvatar from "/avatars/avatardefault.png";
import { UserStatusContext } from "../context/UserStatusContext.jsx";
import { logout, checkAuth } from "../services/auth.services.js";
import { searchUser, addFriend } from "../services/user.services.js";
import socket from "../services/socketClient.js";
import MagicBellWidget from "./MagicBellWidget.jsx";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userAvatar,
  setUserAvatar,
  userPseudo,
  setUserPseudo,
  neonColor,
  setNeonColor,
}) {
  const [langue, setLangue] = useState(
    localStorage.getItem("langue") || "Français"
  );
  const [user, setUser] = useState(null);
  const { status, setStatus } = useContext(UserStatusContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [discriminator, setDiscriminator] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAdding, setIsAdding] = useState({});
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearch(false);
        setSearchResults([]);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showSearch]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      setIsAuthenticated(false);
      setUserAvatar(defaultAvatar);
      setUserPseudo("");
      setNeonColor("#FDD403");
      socket.emit("userOffline");
      window.location.href = "/connexion";
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    socket.emit("statusUpdate", {
      userId: localStorage.getItem("userId"),
      status: newStatus,
    });
  };

  const handleSearch = async (query) => {
    console.log("Recherche déclenchée avec :", query);
    try {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      // Split le pseudo et le discriminateur
      const [pseudo, discriminator] = query.split("#");

      const results = await searchUser(
        pseudo.trim(),
        discriminator ? discriminator.trim() : ""
      );
      console.log("Résultats de recherche :", results);
      setSearchResults(results);
    } catch (error) {
      console.error(
        "Erreur lors de la recherche :",
        error.response?.data || error
      );
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (friendId) => {
    console.log("Envoi de demande d'ami à l'ID :", friendId);
    try {
      setIsAdding((prev) => ({ ...prev, [friendId]: true }));
      const response = await addFriend(friendId); // Envoie une demande au backend
      console.log("Demande d'ami envoyée :", response.message);

      alert("Demande d'ami envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami :", error);
      alert(
        error.response?.data?.message || "Erreur lors de l'envoi de la demande."
      );
    } finally {
      setIsAdding((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };
  // Récupération des informations utilisateur à partir du cookie signé
  const getSignedUser = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split("; authToken=");
    if (parts.length === 2) {
      const token = parts.pop().split(";").shift();
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        console.log("Utilisateur récupéré à partir du cookie :", decodedToken);
        return decodedToken;
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        return null;
      }
    }
    console.warn("Aucun cookie authToken trouvé.");
    return null;
  };

  return (
    <nav className="relative bg-black p-4 shadow-lg flex justify-between items-center">
      {/* Logo */}
      <div
        className="text-5xl font-extrabold text-transparent bg-clip-text"
        style={{
          fontFamily: "'Noto Serif JP', serif",
          letterSpacing: "-4px",
          backgroundImage: `linear-gradient(90deg, #FFD700, #FFFFFF, #FFD700)`,
          filter: `drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))`,
        }}
      >
        {Array.from("KOD_ElDragon").map((letter, index) => (
          <span
            key={index}
            className="inline-block subtle-glow-letter grow-shrink-effect"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-lg">
        <Link
          to="/"
          className="text-white hover:text-yellow-400 transition-all tracking-wider"
        >
          Accueil
        </Link>
        <Link
          to="/videos"
          className="text-white hover:text-yellow-400 transition-all tracking-wider"
        >
          Vidéos
        </Link>
        <Link
          to="/apropos"
          className="text-white hover:text-yellow-400 transition-all tracking-wider"
        >
          À Propos
        </Link>
        <Link
          to="/jeux"
          className="text-white hover:text-yellow-400 transition-all tracking-wider"
        >
          Jeux
        </Link>
        <Link
          to="/contact"
          className="text-white hover:text-yellow-400 transition-all tracking-wider"
        >
          Contact
        </Link>
      </div>
      {/* Menu Burger for Mobile */}
      <div className="md:hidden relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-yellow-400 text-2xl focus:outline-none"
        >
          ☰
        </button>
        {showDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center">
            <div className="w-4/5 bg-gray-900 border border-yellow-500 rounded-lg shadow-lg p-4">
              <div className="flex flex-col space-y-4 text-center">
                <Link
                  to="/"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/videos"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Vidéos
                </Link>
                <Link
                  to="/apropos"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  À Propos
                </Link>
                <Link
                  to="/jeux"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Jeux
                </Link>
                <Link
                  to="/contact"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/connexion"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="text-yellow-500 hover:text-yellow-400 transition-all tracking-wider text-lg"
                  onClick={() => setShowDropdown(false)}
                >
                  Inscription
                </Link>
              </div>

              {/* Language Selector in the Burger Menu */}
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={() => setShowLanguageDropdown((prev) => !prev)}
                  className="text-yellow-500 hover:text-white text-lg transition-all"
                >
                  <FaGlobe className="w-6 h-6" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute bg-gray-800 text-white rounded-lg shadow-lg py-2 z-50 mt-2">
                    {["Français", "Portugais", "Anglais"].map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => handleLanguageChange(lang)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Search Bar */}
      <div className="relative hidden md:flex items-center">
        {showSearch && (
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Rechercher (pseudo#1234)"
            className="w-64 transition-all duration-500 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none border border-gray-600 hover:border-yellow-400"
          />
        )}
        <button
          onClick={() => {
            setShowSearch(!showSearch);
            if (searchQuery) handleSearch(searchQuery);
          }}
          className="text-white ml-2 hover:text-yellow-400 transition-all"
        >
          <FiSearch size={20} />
        </button>

        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 w-64 bg-gray-800 text-white rounded-lg shadow-lg py-2 z-20">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || defaultAvatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {user.pseudo}#{user.discriminator}
                    </p>
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        user.status === "online"
                          ? "bg-green-500"
                          : user.status === "busy"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFriend(user._id)}
                  className="text-xs text-yellow-500 hover:text-yellow-600 transition-all"
                  disabled={isAdding[user._id]}
                >
                  {isAdding[user._id] ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* MagicBell Widget */}
      <MagicBellWidget user={user} />
      <p>Widget chargé</p>
      {/* Bouton de soutien */}
      <Link
        to="/donations"
        className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500 via-white to-yellow-500 text-black rounded-full font-bold tracking-wider hover:scale-105 hover:rotate-1 transition-transform shadow-lg"
        style={{ textShadow: "2px 2px 5px white" }}
      >
        <FaGamepad className="animate-pulse" /> <span>Soutenir</span>
      </Link>
      {/* User Avatar or Authentication Buttons */}
      {!isAuthenticated ? (
        <div className="hidden md:flex space-x-4">
          <Link
            to="/connexion"
            className="text-lg px-5 py-2 border border-yellow-500 text-yellow-500 rounded-full hover:shadow-[0px_0px_10px_2px] hover:shadow-yellow-500 hover:bg-yellow-200 hover:text-black transition-all transform hover:scale-110"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              backgroundSize: "200%",
              backgroundPosition: "left center",
            }}
          >
            Connexion
          </Link>
          <Link
            to="/inscription"
            className="text-lg px-5 py-2 bg-gradient-to-r from-yellow-500 via-white to-yellow-500 text-black rounded-full font-bold hover:animate-pulse transition-all transform hover:scale-110"
            style={{
              textShadow: "2px 2px 5px white",
              fontFamily: "'Noto Serif JP', serif",
              backgroundSize: "200%",
              backgroundPosition: "left center",
            }}
          >
            Inscription
          </Link>
        </div>
      ) : (
        <div className="relative">
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            <img
              src={userAvatar || defaultAvatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-1"
              style={{
                borderColor: neonColor || "#FFF",
                boxShadow: `0 0 10px ${neonColor}`,
              }}
            />
            <span
              className={`absolute bottom-2 right-0 w-3 h-3 rounded-full ${
                status === "online"
                  ? "bg-green-500"
                  : status === "busy"
                  ? "bg-orange-500"
                  : "bg-gray-500"
              }`}
            ></span>
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-800 text-white py-2 rounded-lg shadow-lg z-20"
              ref={dropdownRef}
            >
              <Link to="/profil" className="block px-4 py-2 hover:bg-gray-700">
                Mon Profil
              </Link>
              <Link
                to="/edit-profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Modifier Profil
              </Link>
              <div className="border-t border-gray-600 my-2"></div>
              <button
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => handleStatusChange("online")}
              >
                En ligne
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => handleStatusChange("busy")}
              >
                Occupé
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => handleStatusChange("offline")}
              >
                Hors ligne
              </button>
              <div className="border-t border-gray-600 my-2"></div>
              <button
                className="block px-4 py-2 hover:bg-red-500"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
      {/* Sélecteur de langue */}
      <div className="relative ml-4">
        {/* Language Selector only on Desktop */}
        <button
          onClick={() => setShowLanguageDropdown((prev) => !prev)}
          className="text-white text-lg hover:text-yellow-400 transition-all hidden md:inline-flex"
        >
          <FaGlobe className="w-5 h-5 mr-5" />
        </button>
        {showLanguageDropdown && (
          <div className="absolute right-0  mt-2 w-32 bg-gray-800 text-white rounded-lg shadow-lg py-2 z-20">
            {["Français", "Portugais", "Anglais"].map((lang, index) => (
              <button
                key={index}
                onClick={() => handleLanguageChange(lang)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Ligne dorée animée */}
      <div
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 via-transparent to-yellow-500"
        style={{
          backgroundSize: "200%",
          animation: "gold-line 3s infinite",
        }}
      ></div>
      <style>
        {`
      .subtle-glow-letter {
        animation: subtle-grow-shrink 1.5s infinite cubic-bezier(0.7, 0, 0.2, 1);
      }

      @keyframes subtle-grow-shrink {
        0% {
          transform: scale(0.8);
          text-shadow: 0 0 1px rgba(255, 215, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.5);
        }
        20% {
          transform: scale(1.1);
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 215, 0, 0.8);
        }
        100% {
          transform: scale(0.8);
          text-shadow: 0 0 1px rgba(255, 215, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.5);
        }
      }
        @keyframes gold-line {
        0% {
          background-position: center;
        }
        50% {
          background-position: right;
        }
        100% {
          background-position: left;
        }
      }
      `}
      </style>
    </nav>
  );
}

export default Navbar;

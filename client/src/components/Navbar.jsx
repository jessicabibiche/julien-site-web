import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "/avatars/avatardefault.png";
import { FaGamepad } from "react-icons/fa";
import { searchUser } from "../services/user.services";
function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  userAvatar,
  userPseudo,
}) {
  const [langue, setLangue] = useState("français");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLangueChange = (e) => {
    const newLangue = e.target.value;
    setLangue(newLangue);
    localStorage.setItem("langue", newLangue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("Vous êtes déconnecté");
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Fonction pour gérer la recherche d'amis
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const results = await searchUser(searchTerm);
      setSearchResults(results);
      navigate("/search-friends", { state: { results } });
    } catch (err) {
      console.error("Erreur lors de la recherche d'utilisateur :", err);
    }
  };

  return (
    <nav className="relative bg-black p-4 shadow-lg flex justify-between items-center rounded-lg">
      <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
        KOD_ELDRAGON
      </div>

      <div className="flex items-center space-x-6">
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
        <Link
          to="/donations"
          className="text-lg font-semibold px-4 py-2 transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full hover:shadow-lg flex items-center space-x-2"
        >
          <FaGamepad className="text-white" /> <span>Soutenir</span>
        </Link>
        {/* Champ de recherche d'amis */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Rechercher des amis..."
            className="px-4 py-2 rounded-full bg-gray-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-yellow-500 px-4 py-2 rounded-full text-white"
          >
            Rechercher
          </button>
        </form>
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <div
                className={`w-10 h-10 rounded-full border-4 ${
                  userAvatar === defaultAvatar ? "neon-border-violet" : ""
                }`}
              >
                <img
                  src={userAvatar || defaultAvatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg py-2 z-20">
                <Link
                  to="/profil"
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Mon profil utilisateur
                </Link>
                <Link
                  to="/login friends"
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Amis
                </Link>
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
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/connexion"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Inscription
            </Link>
          </div>
        )}

        <select
          id="langue"
          value={langue}
          onChange={handleLangueChange}
          className="bg-gray-800 text-white border border-yellow-500 rounded-full px-4 py-2 hover:border-yellow-600 transition-all duration-300"
        >
          <option value="français">Français</option>
          <option value="portugais">Portugais</option>
          <option value="anglais">Anglais</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar;

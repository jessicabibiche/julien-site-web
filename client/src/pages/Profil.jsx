import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  requestPasswordReset,
} from "../services/user.services";
import { uploadImageToCloudinary } from "../services/cloudinary.services"; // Service pour Cloudinary

const defaultAvatar =
  "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/avatars/avatardefault.png"; // Avatar par défaut (lien Cloudinary)

const Profil = ({
  setIsAuthenticated,
  setUserAvatar,
  setUserPseudo,
  userStatus,
  setUserStatus,
}) => {
  // États utilisateur
  const [pseudo, setPseudo] = useState(localStorage.getItem("pseudo") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  const [avatar, setAvatar] = useState(
    localStorage.getItem("avatar") || defaultAvatar
  );
  const [lastname, setLastName] = useState(
    localStorage.getItem("lastname") || ""
  );
  const [firstname, setFirstName] = useState(
    localStorage.getItem("firstname") || ""
  );
  const [isFriendsListPublic, setIsFriendsListPublic] = useState(
    localStorage.getItem("isFriendsListPublic") === "true"
  );
  const [neonColor, setNeonColor] = useState(
    localStorage.getItem("neonColor") || "violet"
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const navigate = useNavigate();

  // Références pour chaque champ
  const pseudoInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const bioInputRef = useRef(null);

  // Avatars prédéfinis (liens Cloudinary)
  const predefinedAvatars = Array.from(
    { length: 84 },
    (_, index) =>
      `https://res.cloudinary.com/dfikgdrpn/image/upload/v1/avatars_prédéfinis/avatar${
        index + 1
      }.jpg`
  );

  // Récupération des informations utilisateur au chargement de la page
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setPseudo(user.pseudo || "");
        setEmail(user.email || "");
        setBio(user.bio || "");
        setAvatar(user.avatar || defaultAvatar);
        setLastName(user.lastname || "");
        setFirstName(user.firstname || "");
        setIsFriendsListPublic(user.isFriendsListPublic || false);

        // Mise à jour dans le localStorage pour persistance
        localStorage.setItem("pseudo", user.pseudo || "");
        localStorage.setItem("email", user.email || "");
        localStorage.setItem("bio", user.bio || "");
        localStorage.setItem("avatar", user.avatar || defaultAvatar);
        localStorage.setItem("lastname", user.lastname || "");
        localStorage.setItem("firstname", user.firstname || "");
        localStorage.setItem("isFriendsListPublic", user.isFriendsListPublic);
        localStorage.setItem("neonColor", neonColor);

        // Mise à jour de l'état dans la navbar
        setUserAvatar(user.avatar || defaultAvatar);
        setUserPseudo(user.pseudo || "");
      } catch (err) {
        setError("Impossible de charger le profil.");
      }
    };
    fetchUserProfile();
  }, [setUserAvatar, setUserPseudo]);

  // Mise à jour des informations de la navbar après succès de la modification du profil
  useEffect(() => {
    if (success) {
      setUserAvatar(avatar);
      setUserPseudo(pseudo);
    }
  }, [success, avatar, pseudo, setUserAvatar, setUserPseudo]);

  // Soumission du formulaire de mise à jour du profil
  const handleProfileUpdate = async () => {
    if (!pseudo || !email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const updatedProfile = {
        pseudo,
        bio,
        email,
        lastname,
        firstname,
        isFriendsListPublic,
      };

      const updatedUser = await updateUserProfile(updatedProfile);
      // Mise à jour des informations de l'utilisateur et dans le localStorage
      setPseudo(updatedUser.pseudo || pseudo);
      setEmail(updatedUser.email || email);
      setBio(updatedUser.bio || bio);
      setAvatar(updatedUser.avatar || avatar);
      setLastName(updatedUser.lastname || lastname);
      setFirstName(updatedUser.firstname || firstname);
      setIsFriendsListPublic(
        updatedUser.isFriendsListPublic || isFriendsListPublic
      );

      localStorage.setItem("pseudo", updatedUser.pseudo || pseudo);
      localStorage.setItem("email", updatedUser.email || email);
      localStorage.setItem("bio", updatedUser.bio || bio);
      localStorage.setItem("avatar", updatedUser.avatar || avatar);
      localStorage.setItem("lastname", updatedUser.lastname || lastname);
      localStorage.setItem("firstname", updatedUser.firstname || firstname);
      localStorage.setItem(
        "isFriendsListPublic",
        updatedUser.isFriendsListPublic
      );
      localStorage.setItem("neonColor", neonColor);

      setSuccess("Profil mis à jour avec succès !");
      setIsModified(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Erreur lors de la mise à jour du profil utilisateur");
    }
  };

  // Gestion des modifications de champs
  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsModified(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadResponse = await uploadImageToCloudinary(file);
      const avatarUrl = uploadResponse.secure_url;
      setAvatar(avatarUrl);
      setUserAvatar(avatarUrl);
      localStorage.setItem("avatar", avatarUrl);
      setIsModified(true);
    } catch (err) {
      setError("Erreur lors du téléchargement de l'image. Veuillez réessayer.");
    }
  };

  // Sélection d'un avatar prédéfini
  const handleAvatarSelection = (avatarUrl) => {
    setAvatar(avatarUrl);
    setUserAvatar(avatarUrl);
    localStorage.setItem("avatar", avatarUrl);
    setShowAvatarModal(false);
    setIsModified(true);
  };

  // Gestion du changement de couleur de néon
  const handleNeonEffectChange = (color) => {
    setNeonColor(color);
    localStorage.setItem("neonColor", color);
    setIsModified(true);
  };

  return (
    <div className="profile-page max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      {/* Header du Profil */}
      <div className="flex items-center mb-6">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full cursor-pointer ${
              neonColor ? `neon-border-${neonColor}` : ""
            }`}
            onClick={() => setShowAvatarModal(true)}
          >
            <img
              src={avatar}
              alt="Avatar actuel"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          {/* Indicateur de statut */}
          <span
            className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ${
              userStatus === "online"
                ? "bg-green-500"
                : userStatus === "busy"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></span>
        </div>
        <div className="ml-6">
          <h2 className="text-3xl font-bold text-white">
            {firstname} {lastname}
          </h2>
          <p className="text-xl text-gray-400">@{pseudo}</p>
          <p className="text-sm text-gray-500">
            Dernière connexion : il y a 11 minutes
          </p>
        </div>
      </div>

      {/* Présentation */}
      <div className="relative mb-8">
        <label className="block text-white mb-2">Présentation</label>
        <div className="relative">
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={bio}
            onChange={(e) => handleFieldChange(setBio, e.target.value)}
            placeholder="Parlez de vous..."
          ></textarea>
          <button className="absolute right-2 top-2">
            <img
              src="/avatars/crayon.png"
              alt="Modifier"
              className="w-6 h-6 invert"
            />
          </button>
        </div>
      </div>

      {/* Amis */}
      <div className="friends mb-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Amis</h3>
        <div className="grid grid-cols-3 gap-4">
          {predefinedAvatars.slice(0, 9).map((avatarUrl, index) => (
            <div
              key={index}
              className="friend-card flex items-center bg-gray-800 p-4 rounded-md"
            >
              <img
                src={avatarUrl}
                alt={`Avatar ${index + 1}`}
                className="w-16 h-16 rounded-full border-2 border-white mr-4"
              />
              <div>
                <p className="text-xl text-white">Ami #{index + 1}</p>
                <span className="text-sm text-gray-400">Hors ligne</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sélection d'avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[70vh] overflow-y-scroll">
            <h2 className="text-xl font-bold mb-4">Sélectionner un avatar</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {predefinedAvatars.map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className="w-16 h-16 rounded-full cursor-pointer"
                  onClick={() => handleAvatarSelection(avatarUrl)}
                />
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Télécharger une image
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAvatarModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Couleur du néon */}
      <div className="mt-4">
        <label className="block text-white mb-2">Couleur du néon</label>
        <select
          value={neonColor}
          onChange={(e) => handleNeonEffectChange(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option value="violet">Violet</option>
          <option value="bleu">Bleu</option>
          <option value="vert">Vert</option>
          <option value="orange">Orange</option>
          <option value="jaune">Jaune</option>
          <option value="rouge">Rouge</option>
          <option value="rose">Rose</option>
        </select>
      </div>

      {/* Sauvegarder les modifications */}
      {isModified && (
        <button
          onClick={handleProfileUpdate}
          className="bg-green-500 text-white p-2 mt-4 rounded w-full"
        >
          Sauvegarder les modifications
        </button>
      )}
    </div>
  );
};

export default Profil;

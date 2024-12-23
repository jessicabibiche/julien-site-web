import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  handleProfileUpdate,
  deleteUserAccount,
} from "../services/user.services";
import { uploadImageToCloudinary } from "../services/cloudinary.services";
import { UserStatusContext } from "../context/UserStatusContext.jsx";
import moment from "moment";
import axios from "axios";
import "moment/locale/fr";
import EmojiPicker from "emoji-picker-react";
import "../index.css";
import socket from "../services/socketClient.js";

moment.locale("fr", {
  relativeTime: {
    past: "%s",
    s: "quelques secondes",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 heure",
    hh: "%d heures",
    d: "1 jour",
    dd: "%d jours",
    w: "1 semaine",
    ww: "%d semaines",
    M: "1 mois",
    MM: "%d mois",
    y: "1 an",
    yy: "%d ans",
  },
});

const defaultAvatar =
  "https://res.cloudinary.com/dfikgdrpn/image/upload/v1/avatars/avatardefault.png";

const Profil = ({
  setIsAuthenticated,
  setUserAvatar,
  setUserPseudo,
  userStatus,
  setUserStatus,
}) => {
  // États utilisateur
  const { status, lastOnline } = useContext(UserStatusContext);
  const [friends, setFriends] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isFriendsListPublic, setIsFriendsListPublic] = useState(false);
  const [neonColor, setNeonColor] = useState("violet");

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();

  // Références pour chaque champ
  const pseudoInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const bioInputRef = useRef(null);

  const [avatars, setAvatars] = useState([]);

  // Utilisation de socket pour indiquer que l'utilisateur est en ligne
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Lorsque le composant est monté, signaler que l'utilisateur est en ligne
      socket.emit("userOnline", userId);

      // Ajouter des écouteurs pour les événements liés à Socket.IO
      socket.on("disconnect", () => {
        console.log("Déconnecté du serveur");
      });

      socket.on("connect_error", (err) => {
        console.error("Erreur de connexion Socket.IO :", err);
      });

      socket.on("reconnect_attempt", (attempt) => {
        console.log(`Tentative de reconnexion n°${attempt}`);
      });

      // Écouter les mises à jour de statut des amis
      socket.on("friendStatusUpdate", ({ userId, status, lastOnline }) => {
        setFriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend.id === userId
              ? {
                  ...friend,
                  status,
                  lastOnline: lastOnline || friend.lastOnline,
                }
              : friend
          )
        );

        // Mettre à jour le nombre d'amis en ligne
        const onlineFriends = friends.filter(
          (friend) => friend.status === "online"
        );
        setOnlineCount(onlineFriends.length);
      });
    }

    // Fonction de nettoyage pour signaler que l'utilisateur est hors ligne lorsqu'il quitte la page
    return () => {
      if (userId) {
        socket.emit("userOffline", userId);
      }
      socket.off("friendStatusUpdate"); // Nettoyer l'écouteur
    };
  }, [friends]);

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
        setIsFriendsListPublic(user.isFriendsListPublic || false);

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
    if (!isModified) return;
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
        isFriendsListPublic,
      };

      const updatedUser = await handleProfileUpdate(updatedProfile);
      // Mise à jour des informations de l'utilisateur et dans le localStorage
      setPseudo(updatedUser.pseudo || pseudo);
      setEmail(updatedUser.email || email);
      setBio(updatedUser.bio || bio);
      setAvatar(updatedUser.avatar || avatar);
      setIsFriendsListPublic(
        updatedUser.isFriendsListPublic || isFriendsListPublic
      );

      localStorage.setItem("pseudo", updatedUser.pseudo || pseudo);
      localStorage.setItem("email", updatedUser.email || email);
      localStorage.setItem("bio", updatedUser.bio || bio);
      localStorage.setItem("avatar", updatedUser.avatar || avatar);
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
  // Charger la liste des amis
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsList = await getFriends();
        setFriends(friendsList || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des amis :", error);
        setError("Impossible de charger la liste des amis.");
      }
    };

    fetchFriends();
  }, []);

  // Récupérer les avatars de Cloudinary au chargement du composant
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/avatars/cloudinary/avatars"
        );
        setAvatars(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des avatars :", err);
        setError("Erreur lors de la récupération des avatars");
      }
    };
    fetchAvatars();
  }, []);

  // Gestion des modifications de champs
  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsModified(true);
  };

  // Focalisation sur le champ "bio" lorsqu'on clique sur le crayon
  const handleEditBioClick = () => {
    if (bioInputRef.current) {
      bioInputRef.current.focus();
    }
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

  const getLastOnlineText = () => {
    if (status === "online") {
      return "En ligne maintenant";
    } else if (status === "busy") {
      return "Occupé";
    } else if (lastOnline) {
      return `Dernière connexion : ${moment(lastOnline).fromNow()}`;
    } else {
      return "Hors ligne";
    }
  };
  // Annuler la modification de la bio
  const handleCancelEdit = () => {
    setBio(localStorage.getItem("bio") || ""); // Restaurer la valeur précédente
    setIsModified(false);
  };

  // Ajouter un emoji à la bio
  const addEmoji = (emojiObject) => {
    setBio((prevBio) => prevBio + emojiObject.emoji);
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
            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full ${
              status === "online"
                ? "bg-green-500"
                : status === "busy"
                ? "bg-orange-500"
                : "bg-gray-500"
            }`}
          ></span>
        </div>
        <div className="ml-6">
          <h2 className="text-3xl font-bold text-gray-400">{pseudo}</h2>
          <p className="text-sm text-gray-500">{getLastOnlineText()}</p>
        </div>
      </div>
      {/* Présentation */}
      <div className="relative mb-8">
        <label className="block text-white mb-2">Présentation</label>
        <div className="relative">
          <textarea
            ref={bioInputRef} // Ajout de la référence
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setIsModified(true);
            }}
            placeholder="Parlez de vous..."
          ></textarea>
          {/* Bouton Emoji */}
          <button
            className="absolute right-2 top-2 text-yellow-500"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            title="Ajouter un émoji"
          >
            😊
          </button>
          {/* Affichage du Picker d'Emoji */}
          {showEmojiPicker && (
            <div
              className="absolute z-10 mt-2"
              style={{
                top: "100%",
                right: "0",
                transform: "translateX(0)",
              }}
            >
              <EmojiPicker onEmojiClick={addEmoji} className="epr-dark-theme" />
            </div>
          )}
        </div>

        {isModified && (
          <div className="flex gap-4 mt-2">
            <button
              className="text-white bg-transparent border border-gray-500 px-4 py-1 rounded-lg transition-all hover:border-red-500 hover:text-red-500"
              onClick={handleCancelEdit}
            >
              Annuler
            </button>
            <button
              className="text-white bg-green-500 px-4 py-1 rounded-lg transition-all hover:bg-green-700"
              onClick={handleProfileUpdate}
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
      {/* Amis */}
      <div>
        <h3>
          Vous avez {friends.length} amis, dont {onlineCount} en ligne
        </h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              <p>Pseudo : {friend.pseudo}</p>
              <p>
                Statut :{" "}
                {friend.status === "online"
                  ? "En ligne"
                  : friend.status === "busy"
                  ? "Occupé"
                  : `Hors ligne depuis ${moment(friend.lastOnline).fromNow()}`}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* Sélection d'avatar et paramètres du profil */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Personnaliser votre avatar
            </h2>

            {/* Sélection des Avatars Prédéfinis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Choisir un avatar prédéfini
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatarUrl, index) => (
                  <img
                    key={index}
                    src={avatarUrl}
                    alt={`Avatar ${index + 1}`}
                    className="w-16 h-16 rounded-full cursor-pointer"
                    onClick={() => handleAvatarSelection(avatarUrl)}
                  />
                ))}
              </div>
            </div>

            {/* Téléchargement d'une Image Locale */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Télécharger une image locale
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (upload) => {
                      const localAvatarUrl = upload.target.result;
                      setAvatar(localAvatarUrl); // Utiliser l'image téléchargée comme avatar
                      setUserAvatar(localAvatarUrl);
                      localStorage.setItem("avatar", localAvatarUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>

            {/* Choix de la Couleur du Néon */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Choisir la couleur du néon
              </h3>
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

            {/* Bouton de Fermeture de la Modale */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAvatarModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;

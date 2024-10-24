import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  requestPasswordReset,
} from "../services/user.services";

const defaultAvatar = "/avatars/avatardefault.png"; // Avatar par défaut

const Profil = ({ setIsAuthenticated, setUserAvatar, setUserPseudo }) => {
  // Déclaration des états
  const [pseudo, setPseudo] = useState(
    () => localStorage.getItem("pseudo") || ""
  );
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("bio") || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("avatar") || defaultAvatar
  );
  const [lastname, setLastName] = useState(
    () => localStorage.getItem("lastname") || ""
  );
  const [firstname, setFirstName] = useState(
    () => localStorage.getItem("firstname") || ""
  );
  const [address, setAddress] = useState(
    () => localStorage.getItem("address") || ""
  );
  const [phone, setPhone] = useState(() => localStorage.getItem("phone") || "");
  const [isFriendsListPublic, setIsFriendsListPublic] = useState(
    () => localStorage.getItem("isFriendsListPublic") === "true"
  ); // Conversion en booléen
  const [neonColor, setNeonColor] = useState("violet");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [, setIsCapsLockOn] = useState(false); // Gestion de Caps Lock
  const [useNeonEffect, setUseNeonEffect] = useState(true);
  const navigate = useNavigate();

  // Références pour chaque champ
  const pseudoInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const bioInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Avatars prédéfinis
  const predefinedAvatars = Array.from(
    { length: 84 },
    (_, index) => `/avatars/avatar${index + 1}.jpg`
  );

  // Gestion du changement de couleur de néon
  const handleNeonEffectChange = (color) => {
    if (color === "none") {
      setUseNeonEffect(false);
    } else {
      setUseNeonEffect(true);
      setNeonColor(color);
    }
  };

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
        setAddress(user.address || "");
        setPhone(user.phone || "");
        setIsFriendsListPublic(user.isFriendsListPublic || false);

        // Mise à jour dans le localStorage pour persistance
        localStorage.setItem("pseudo", user.pseudo || "");
        localStorage.setItem("email", user.email || "");
        localStorage.setItem("bio", user.bio || "");
        localStorage.setItem("avatar", user.avatar || defaultAvatar);
        localStorage.setItem("lastname", user.lastname || "");
        localStorage.setItem("firstname", user.firstname || "");
        localStorage.setItem("address", user.address || "");
        localStorage.setItem("phone", user.phone || "");
        localStorage.setItem("isFriendsListPublic", user.isFriendsListPublic);

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
        address,
        phone,
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
      setAddress(updatedUser.address || address);
      setPhone(updatedUser.phone || phone);
      setIsFriendsListPublic(
        updatedUser.isFriendsListPublic || isFriendsListPublic
      );

      localStorage.setItem("pseudo", updatedUser.pseudo || pseudo);
      localStorage.setItem("email", updatedUser.email || email);
      localStorage.setItem("bio", updatedUser.bio || bio);
      localStorage.setItem("avatar", updatedUser.avatar || avatar);
      localStorage.setItem("lastname", updatedUser.lastname || lastname);
      localStorage.setItem("firstname", updatedUser.firstname || firstname);
      localStorage.setItem("address", updatedUser.address || address);
      localStorage.setItem("phone", updatedUser.phone || phone);
      localStorage.setItem(
        "isFriendsListPublic",
        updatedUser.isFriendsListPublic
      );

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

  // Soumission de la demande de réinitialisation du mot de passe
  const handlePasswordSubmit = async () => {
    try {
      await requestPasswordReset(email);
      setSuccess("Un email de réinitialisation de mot de passe a été envoyé.");
      setShowPasswordModal(false);
    } catch (error) {
      setError("Erreur lors de la demande de réinitialisation du mot de passe");
    }
  };

  // Suppression du compte utilisateur
  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        await deleteUserAccount();
        localStorage.removeItem("token");
        localStorage.removeItem("pseudo");
        localStorage.removeItem("email");
        localStorage.removeItem("bio");
        localStorage.removeItem("avatar");
        setIsAuthenticated(false);
        navigate("/");
      } catch (err) {
        setError("Erreur lors de la suppression du compte.");
      }
    }
  };

  // Gestion du téléchargement d'un fichier pour l'avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validation du type de fichier
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && validImageTypes.includes(file.type)) {
      setAvatarFile(file);

      // Créer une URL pour l'aperçu de l'image sélectionnée
      const avatarUrl = URL.createObjectURL(file);
      setSelectedAvatar(avatarUrl);
      setAvatar(avatarUrl);
      setUserAvatar(avatarUrl);
      setUseNeonEffect(false);

      // Mise à jour dans le localStorage
      localStorage.setItem("avatar", avatarUrl);
      setIsModified(true); // Activer le bouton de sauvegarde en cas de modification

      // Révoquer l'ancienne URL pour éviter les fuites de mémoire
      return () => {
        URL.revokeObjectURL(avatarUrl); // Révocation de l'URL après utilisation
      };
    } else {
      // Gestion des erreurs si le fichier n'est pas une image valide
      setError("Veuillez sélectionner une image valide (JPEG, PNG, JPG)");
    }
  };

  // Sélection d'un avatar prédéfini
  const handleAvatarSelection = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setAvatar(avatarUrl);
    setUserAvatar(avatarUrl);
    setUseNeonEffect(false);
    setShowAvatarModal(false);

    // Mise à jour dans le localStorage
    localStorage.setItem("avatar", avatarUrl);
    setIsModified(true); // Activer le bouton de sauvegarde en cas de modification
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-900 rounded-md shadow-lg neon-box">
      <h2 className="text-3xl font-bold mb-6 text-white neon-text">
        Mon Profil
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Avatar */}
      <div className="flex items-center space-x-2 mb-4">
        <div
          className={`w-20 h-20 rounded-full cursor-pointer ${
            useNeonEffect ? `neon-border-${neonColor}` : ""
          }`}
          onClick={() => setShowAvatarModal(true)}
        >
          <img
            src={avatar || defaultAvatar}
            alt="Avatar actuel"
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>
      </div>

      {/* Pseudo */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Pseudo</label>
        <div className="relative">
          <input
            ref={pseudoInputRef}
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            value={pseudo}
            onChange={(e) => handleFieldChange(setPseudo, e.target.value)}
            placeholder="Votre pseudo"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => pseudoInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Email</label>
        <div className="relative">
          <input
            ref={emailInputRef}
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="email"
            value={email}
            onChange={(e) => handleFieldChange(setEmail, e.target.value)}
            placeholder="Votre email"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => emailInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Prénom */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Prénom</label>
        <div className="relative">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            value={firstname}
            onChange={(e) => handleFieldChange(setFirstName, e.target.value)}
            placeholder="Votre prénom"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => pseudoInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Nom */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Nom</label>
        <div className="relative">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            value={lastname}
            onChange={(e) => handleFieldChange(setLastName, e.target.value)}
            placeholder="Votre nom"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => pseudoInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Adresse */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Adresse</label>
        <div className="relative">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            value={address}
            onChange={(e) => handleFieldChange(setAddress, e.target.value)}
            placeholder="Votre adresse"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => pseudoInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Téléphone */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Téléphone</label>
        <div className="relative">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="tel"
            value={phone}
            onChange={(e) => handleFieldChange(setPhone, e.target.value)}
            placeholder="Votre numéro de téléphone"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => pseudoInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Bio</label>
        <div className="relative">
          <textarea
            ref={bioInputRef}
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={bio}
            onChange={(e) => handleFieldChange(setBio, e.target.value)}
            placeholder="Parlez de vous..."
          ></textarea>
          <button
            className="absolute right-2 top-2"
            onClick={() => bioInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mot de passe */}
      <div className="relative mb-4">
        <label className="block text-white mb-2">Mot de passe</label>
        <div className="relative">
          <input
            ref={passwordInputRef}
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="password"
            value={password}
            onChange={(e) => handleFieldChange(setPassword, e.target.value)}
            placeholder="********"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => passwordInputRef.current.focus()}
          >
            <img src="/avatars/crayon.png" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Rendre la liste d'amis publique */}
      <div>
        <label className="block text-white mb-2">
          Rendre ma liste d'amis publique :
        </label>
        <input
          type="checkbox"
          checked={isFriendsListPublic}
          onChange={(e) => setIsFriendsListPublic(e.target.checked)}
        />
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

      {/* Modifier le mot de passe */}
      <button
        className="bg-blue-500 text-white p-2 rounded w-full mt-2"
        onClick={() => setShowPasswordModal(true)}
      >
        Modifier le mot de passe
      </button>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Changer le mot de passe</h3>
            <p className="mb-2 text-gray-700">
              Une demande de réinitialisation sera envoyée à votre email.
            </p>
            <button
              className="mt-4 bg-green-500 text-white p-2 rounded w-full"
              onClick={handlePasswordSubmit}
            >
              Envoyer la demande de réinitialisation
            </button>
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded w-full"
              onClick={() => setShowPasswordModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Suppression de compte */}
      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white p-2 mt-4 rounded w-full"
      >
        Supprimer mon compte
      </button>

      {/* Sélection d'avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[70vh] overflow-y-scroll">
            <h2 className="text-xl font-bold mb-4">Sélectionner un avatar</h2>

            <h3 className="text-lg font-semibold mb-2">Jeux vidéo</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {predefinedAvatars.slice(0, 28).map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className="w-16 h-16 rounded-full cursor-pointer"
                  onClick={() => handleAvatarSelection(avatarUrl)}
                />
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-2">Manga</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {predefinedAvatars.slice(28, 56).map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className="w-16 h-16 rounded-full cursor-pointer"
                  onClick={() => handleAvatarSelection(avatarUrl)}
                />
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-2">Autres</h3>
            <div className="grid grid-cols-4 gap-4">
              {predefinedAvatars.slice(56).map((avatarUrl, index) => (
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
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAvatarModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Changement de la couleur du néon */}
      <div className="mt-4">
        <label className="block text-white mb-2">Couleur du néon</label>
        <select
          value={neonColor}
          onChange={(e) => handleNeonEffectChange(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option value="none">Aucun néon</option>
          <option value="violet">Violet</option>
          <option value="bleu">Bleu</option>
          <option value="vert">Vert</option>
          <option value="orange">Orange</option>
          <option value="jaune">Jaune</option>
          <option value="rouge">Rouge</option>
          <option value="rose">Rose</option>
        </select>
      </div>
    </div>
  );
};

export default Profil;

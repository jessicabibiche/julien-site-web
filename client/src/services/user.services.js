import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Fonction pour supprimer un compte utilisateur
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${baseUrl}/edit-profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du compte :", error);
    throw error;
  }
};

// Fonction pour récupérer les informations du profil utilisateur
export const getUserProfile = async () => {
  try {
    console.log("Tentative de récupération du profil utilisateur...");
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    const response = await axios.get(`${baseUrl}/edit-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profil utilisateur récupéré :", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur :",
      error.response || error
    );
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expirée, veuillez vous reconnecter");
    }
    throw error;
  }
};

// Fonction pour mettre à jour le profil utilisateur (bio, avatar, neon)
export const handleProfileUpdate = async (updatedProfile) => {
  try {
    const response = await axios.put(
      `${baseUrl}/edit-profile`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du profil utilisateur :",
      error
    );
    throw error;
  }
};

// Fonction pour mettre à jour le mot de passe de l'utilisateur
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${baseUrl}/edit-profile/password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    throw error;
  }
};

// Fonction pour demander la réinitialisation du mot de passe
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/request-password-reset`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation du mot de passe :",
      error
    );
    throw error;
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};

// Ajouter un ami
export const addFriend = async (friendId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${baseUrl}/users/add-friend`,
      { friendId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'ami :", error);
    throw error;
  }
};

// Supprimer un ami
export const removeFriend = async (friendId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${baseUrl}/users/remove-friend`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { friendId },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression d'ami :", error);
    throw error;
  }
};

// Fonction pour rechercher un utilisateur par pseudo et discriminator
export const searchUser = async (pseudo, discriminator) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Pas de token JWT trouvé. Vous devez être connecté.");
    }

    const response = await axios.get(`${baseUrl}/users/search`, {
      params: { pseudo, discriminator },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur :", error);
    throw error;
  }
};

// Fonction pour obtenir les amis d'un utilisateur
export const getUserFriends = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}/users/${userId}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des amis :", error);
    throw error;
  }
};

// Fonction pour uploader un avatar utilisateur

export default {
  getUserProfile,
  handleProfileUpdate,
  updateUserPassword,
  requestPasswordReset,
  getAllUsers,
  addFriend,
  removeFriend,
  searchUser,
  getUserFriends,

  deleteUserAccount,
};

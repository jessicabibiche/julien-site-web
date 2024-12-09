import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Fonction pour supprimer un compte utilisateur
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${baseUrl}/edit-profile`, {
      withCredentials: true,
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
    const response = await axios.get(`${baseUrl}/edit-profile`, {
      withCredentials: true,
    });
    console.log("Profil utilisateur récupéré :", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur :",
      error.response || error
    );
    if (error.response && error.response.status === 401) {
      throw new Error("Session expirée, veuillez vous reconnecter");
    }
    throw error;
  }
};

// Fonction pour mettre à jour le profil utilisateur (bio, avatar, neon)
export const handleProfileUpdate = async (updatedProfile) => {
  try {
    const response = await axios.put(`${baseUrl}/profile`, updatedProfile, {
      withCredentials: true,
    });
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
        withCredentials: true,
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
      `${baseUrl}/edit-profile/request-password-reset`,
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
    const response = await axios.get(`${baseUrl}/users`, {
      withCredentials: true,
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
    console.log("Tentative d'ajout d'ami avec friendId :", friendId);
    console.log("URL complète :", `${baseUrl}/users/add-friend/${friendId}`);
    const response = await axios.post(
      `${baseUrl}/users/add-friend/${friendId}`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Réponse de l'ajout d'ami :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'ami :", error);
    if (error.response) {
      console.error("Statut de l'erreur :", error.response.status);
      console.error("Données de l'erreur :", error.response.data);
    }
    throw error;
  }
};

// Supprimer un ami
export const removeFriend = async (friendId) => {
  try {
    const response = await axios.delete(`${baseUrl}/users/remove-friend`, {
      withCredentials: true,
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
    const response = await axios.get(`${baseUrl}/users/search`, {
      params: { pseudo, discriminator },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur :", error);
    throw error;
  }
};

// Fonction pour obtenir les amis d'un utilisateur connecté
export const getFriends = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users/get-friends`, {
      withCredentials: true,
    });
    return response.data.friends;
  } catch (error) {
    console.error("Erreur lors de la récupération des amis :", error);
    throw error;
  }
};

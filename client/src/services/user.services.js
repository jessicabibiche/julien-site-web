import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Fonction pour supprimer un compte utilisateur
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${baseUrl}/profile`, {
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
    const response = await axios.get(`${baseUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur :",
      error
    );
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expirée, veuillez vous reconnecter");
    }
    throw error;
  }
};

// Fonction pour mettre à jour le profil utilisateur (pseudo, email, bio, avatar)
export const updateUserProfile = async (updatedProfile) => {
  try {
    const response = await axios.put(`${baseUrl}/profile`, updatedProfile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
export const updateUserPassword = async (updatedPassword) => {
  try {
    const response = await axios.put(
      `${baseUrl}/profile/password`,
      updatedPassword,
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
  const token = localStorage.getItem("token");
  const response = await axios.get(`${baseUrl}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Ajouter un ami
export const addFriend = async (friendId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${baseUrl}/users/add-friend`,
    { friendId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Supprimer un ami
export const removeFriend = async (friendId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${baseUrl}/users/remove-friend`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { friendId },
  });
  return response.data;
};

// Fonction pour rechercher un utilisateur par pseudo et discriminator
export const searchUser = async (pseudo, discriminator) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Pas de token JWT trouvé. Vous devez être connecté.");
  }

  try {
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

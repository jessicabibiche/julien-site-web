import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) throw new Error("VITE_API_URL n'est pas définie");

// Inscription
export const register = async (pseudo, email, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/register`,
      { pseudo, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Erreur lors de l'inscription";
    throw new Error(errorMessage);
  }
};

// Connexion
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Stocker le token dans localStorage
    const token = response.data.token;
    console.log("Token reçu après connexion :", token); // Vérifie le token ici
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la connexion");
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await axios.post(`${baseUrl}/auth/logout`, null, {
      withCredentials: true,
    });
    localStorage.clear(); // Supprimez toutes les données locales après déconnexion
  } catch (error) {
    throw new Error("Erreur lors de la déconnexion");
  }
};

// Vérification de l'authentification
export const checkAuth = async () => {
  try {
    // Récupérer le token depuis les cookies ou le localStorage
    const token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || localStorage.getItem("token");

    if (!token) {
      throw new Error("Token JWT manquant.");
    }

    // Envoyer une requête au backend pour vérifier l'authentification
    const response = await axios.get(`${baseUrl}/auth/check-auth`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true, // Assure l'envoi des cookies (si nécessaire)
    });

    return response.data; // Retourne les données de l'utilisateur
  } catch (error) {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("token"); // Supprimez le token s'il est invalide
      throw new Error("Accès refusé. Veuillez vous reconnecter.");
    }
    throw error;
  }
};

export default { register, login, logout, checkAuth };

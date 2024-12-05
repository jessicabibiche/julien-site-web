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
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la connexion"
    );
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await axios.post(`${baseUrl}/auth/logout`, null, {
      withCredentials: true,
    });
    localStorage.clear();
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    throw new Error("Erreur lors de la déconnexion");
  }
};

// Vérification de l'authentification
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${baseUrl}/auth/check-auth`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification :",
      error
    );
    return { authenticated: false };
  }
};

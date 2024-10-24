// Fonction pour l'inscription
export const register = async (pseudo, email, password) => {
  const baseUrl = import.meta.env.VITE_API_URL; // Récupérer l'URL de base
  if (!baseUrl) throw new Error("VITE_API_URL n'est pas définie");

  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pseudo, email, password }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
};

// Fonction pour la connexion
export const login = async (email, password) => {
  const baseUrl = import.meta.env.VITE_API_URL; // Récupérer l'URL de base
  if (!baseUrl) throw new Error("VITE_API_URL n'est pas définie");

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Erreur lors de la connexion");
  return data;
};

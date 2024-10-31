import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    pseudo: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charger les informations actuelles de l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/v1/profile", {
          withCredentials: true,
        });
        const { pseudo, firstname, lastname, address, phone } = response.data;
        setFormData({
          ...formData,
          pseudo,
          firstname,
          lastname,
          address,
          phone,
        });
      } catch (err) {
        setError("Impossible de charger les informations de profil.");
      }
    };
    fetchUserProfile();
  }, []);

  // Gérer les modifications des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumettre le formulaire de mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        pseudo,
        firstname,
        lastname,
        address,
        phone,
        currentPassword,
        newPassword,
      } = formData;
      await axios.put(
        "/api/v1/profile",
        {
          pseudo,
          firstname,
          lastname,
          address,
          phone,
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Modifier le profil</h2>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {["pseudo", "prénom", "nom", "addresse", "téléphone"].map(
          (field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-semibold mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          )
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Mettre à jour le profil
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

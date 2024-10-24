import React, { useState } from "react";

function Contact() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pseudo || !email || !message) {
      setErrorMessage("Tous les champs sont obligatoires");
      return;
    }

    try {
      // Récupérer le token JWT depuis le localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Vous devez être connecté pour envoyer un message");
        return;
      }

      // Envoyer la requête avec le token dans le header Authorization
      const response = await fetch("http://localhost:5000/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pseudo, email, message }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setPseudo("");
      setEmail("");
      setMessage("");
      setErrorMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setErrorMessage("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-800 rounded-md">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full p-2 rounded"
          type="text"
          placeholder="Votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded"
          placeholder="Votre message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="bg-yellow-500 w-full p-2 rounded hover:bg-yellow-400">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default Contact;

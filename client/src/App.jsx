import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Support from "./pages/Support";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Videos from "./pages/Videos";
import VideoGallery from "./components/VideoGallery";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Profil from "./pages/Profil";
import Donations from "./pages/Donations";
import AddFriendsPage from "./pages/AddFriendsPage.jsx";
import Jeux from "./pages/Jeux";
import EditProfile from "./pages/EditProfile";
import { getUserProfile } from "./services/user.services";
import { checkAuth } from "./services/auth.services";
import defaultAvatar from "/avatars/avatardefault.png";

// Route privée pour protéger certaines pages
const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/connexion" />;
};

function App() {
  // État global pour l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAvatar, setUserAvatar] = useState(defaultAvatar); // Avatar utilisateur par défaut
  const [userPseudo, setUserPseudo] = useState(""); // Pseudo de l'utilisateur
  const [neonColor, setNeonColor] = useState("#FDD403"); // Couleur de l'effet néon
  const [loading, setLoading] = useState(true); // Gestion du chargement
  const [userId, setUserId] = useState(null); // ID utilisateur
  const [userEmail, setUserEmail] = useState(null); // Email utilisateur

  // Récupération des données utilisateur lors du montage du composant
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Vérification de l'authentification en cours...");
        const authResponse = await checkAuth();

        if (authResponse.authenticated) {
          console.log("Utilisateur authentifié :", authResponse.user);

          setIsAuthenticated(true);
          setUserId(authResponse.user._id); // Utilisez `_id` pour l'ID
          setUserEmail(authResponse.user.email); // Récupérez l'email
          setUserAvatar(authResponse.user.avatar || defaultAvatar); // Utilisez l'avatar
          setUserPseudo(authResponse.user.pseudo || "Utilisateur"); // Utilisez le pseudo
          setNeonColor(authResponse.user.neonColor || "#FDD403"); // Utilisez la couleur néon
        } else {
          console.warn("Utilisateur non authentifié");
          throw new Error("Non authentifié");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur :",
          error
        );
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Affiche un écran de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <Router>
      {/* Passe les informations utilisateur à la Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
        userPseudo={userPseudo}
        setUserPseudo={setUserPseudo}
        neonColor={neonColor}
        setNeonColor={setNeonColor}
        userId={userId} // Passe userId à la Navbar
        userEmail={userEmail} // Passe userEmail à la Navbar
      />

      <div className="bg-black bg-opacity-60 min-h-screen">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/connexion"
            element={<Connexion setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/inscription"
            element={<Inscription setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/videogallery" element={<VideoGallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/apropos" element={<APropos />} />
          <Route path="/jeux" element={<Jeux />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/profil"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profil />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route path="/add-friend" element={<AddFriendsPage />} />
          <Route path="/donations" element={<Donations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

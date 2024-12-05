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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const [userPseudo, setUserPseudo] = useState("");
  const [neonColor, setNeonColor] = useState("#FDD403");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Vérification de l'authentification en cours...");
        const authResponse = await checkAuth(); // Vérifie si l'utilisateur est authentifié

        if (authResponse.authenticated) {
          console.log("Utilisateur authentifié :", authResponse.user);
          const userProfile = await getUserProfile(); // Récupère le profil utilisateur

          setIsAuthenticated(true);
          setUserAvatar(userProfile.avatar || defaultAvatar);
          setUserPseudo(userProfile.pseudo || "Utilisateur");
          setNeonColor(userProfile.neonColor || "#FDD403");
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
        setLoading(false); // Terminer le chargement
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userAvatar={userAvatar}
        userPseudo={userPseudo}
        neonColor={neonColor}
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

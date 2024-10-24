import React from "react";
import LiveTwitch from "../components/LiveTwitch";
import Videos from "../components/VideoGallery";

function Accueil() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-0 m-0"
      style={{ backgroundImage: "url('/images/dragon.png')" }}
    >
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Bienvenue sur le site de KOD_ElDragon!
        </h1>
        <p className="mb-6 text-white">
          Rejoignez l'aventure en direct, suivez nos vidéos et soutenez notre
          parcours de jeu.
        </p>

        {/* Section Live Twitch */}
        <LiveTwitch />

        {/* Galerie de Vidéos */}
        <div className="mt-10">
          <Videos />
        </div>
      </div>
    </div>
  );
}

export default Accueil;

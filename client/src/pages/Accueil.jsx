import React from "react";
import LiveTwitch from "../components/LiveTwitch";
import Videos from "../components/VideoGallery";

function Accueil() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-0 m-0 relative"
      style={{
        backgroundImage: "url('/images/dragon.png')",
      }}
    >
      {/* Effet d'ombre légèrement réduit */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))",
        }}
      ></div>

      <div className="relative p-8 max-w-6xl mx-auto">
        {/* Conteneur avec fond translucide */}
        <div
          className="bg-black bg-opacity-50 p-6 rounded-lg mx-auto"
          style={{
            backdropFilter: "blur(5px)",
            boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
          }}
        >
          <h1
            className="text-5xl font-extrabold mb-6 text-center"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: "white",
              textShadow: "0 0 15px rgba(255, 215, 0, 0.8)",
            }}
          >
            Bienvenue sur le site de KOD_ElDragon!
          </h1>
          <p
            className="text-lg text-center"
            style={{
              fontFamily: "'Roboto', sans-serif",
              lineHeight: "1.8",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            Découvrez KOD_ElDragon, un streameur passionné qui partage son
            aventure avec vous en direct sur Twitch. Avec son frère, créateur de
            jeux vidéo, ils forment une équipe unique combinant divertissement
            et innovation. Rendez-vous sur la page{" "}
            <a
              href="/jeux"
              className="text-yellow-400 underline hover:text-yellow-500"
            >
              Jeux
            </a>{" "}
            pour explorer ses créations !
          </p>
        </div>

        {/* Espacement entre cette section et Twitch */}
        <div className="mt-16"></div>

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

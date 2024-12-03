import React from "react";

function APropos() {
  // Découper "KOD_ElDragon" en lettres individuelles pour l'effet de survol
  const name = "KOD_ElDragon".split("");

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-6 md:px-12 lg:px-24">
      {/* Titre principal de la page */}
      <h1 className="text-4xl lg:text-5xl font-bold text-center mb-8">
        À propos de{" "}
        <span className="inline-block text-yellow-400">
          {name.map((letter, index) => (
            <span
              key={index}
              className="inline-block neon-effect"
              style={{
                transition: "transform 0.3s ease, text-shadow 0.3s ease",
                display: "inline-block",
                color: "#FACC15", // Couleur dorée de base pour le texte
              }}
              onMouseEnter={(e) => {
                e.target.classList.add("neon-hover"); // Ajouter l'effet au survol
              }}
              onMouseLeave={(e) => {
                e.target.classList.remove("neon-hover"); // Enlever l'effet au survol
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      </h1>

      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed mb-12 text-center">
        <p>
          <span className="font-semibold text-yellow-400">
            {name.map((letter, index) => (
              <span
                key={index}
                className="inline-block neon-effect"
                style={{
                  transition: "transform 0.3s ease, text-shadow 0.3s ease",
                  display: "inline-block",
                  color: "#FACC15", // Couleur dorée de base pour le texte
                }}
                onMouseEnter={(e) => {
                  e.target.classList.add("neon-hover");
                }}
                onMouseLeave={(e) => {
                  e.target.classList.remove("neon-hover");
                }}
              >
                {letter}
              </span>
            ))}
          </span>{" "}
          est un passionné de jeux vidéo et un streameur dédié à la communauté
          des gamers. Depuis plusieurs années, il partage sa passion pour les
          jeux vidéo avec ses abonnés, explorant divers genres, des jeux
          d'aventure aux jeux de tir en passant par les jeux de rôle.
        </p>
        <p className="mt-6">
          Plus qu'un simple joueur, KOD_ElDragon rêve de former une team de
          joueurs pour partir à la conquête des classements et participer à des
          compétitions. Avec une grande ambition et une volonté de fer, il
          souhaite un jour bâtir une communauté de gamers unie, forte et
          compétitive.
        </p>
      </div>

      {/* Citation inspirante ou message personnel */}
      <div className="relative py-8 px-6 bg-gray-700 rounded-lg shadow-lg max-w-2xl mx-auto text-center overflow-hidden rotating-border-container hover-effect">
        <p className="italic text-xl text-gray-300">
          "Les jeux vidéo ne sont pas seulement un passe-temps, ils sont un art
          et un mode de vie. Un jour, je rêve de bâtir une team, de rassembler
          les meilleurs joueurs pour créer quelque chose de grand et
          d'inoubliable."
        </p>
        <p className="font-semibold mt-4">- KOD_ElDragon</p>
      </div>

      {/* CSS personnalisé pour les animations */}
      <style>
        {`
          /* Effet néon plus subtil autour des lettres */
          .neon-effect {
            color: #FACC15; /* Couleur de base des lettres */
            text-shadow:
              0 0 5px rgba(255, 223, 0, 0.5),
              0 0 10px rgba(255, 223, 0, 0.4); /* Lueur plus discrète */
            transition: transform 0.3s ease, text-shadow 0.3s ease;
          }

          /* Effet de surbrillance au survol */
          .neon-hover {
            text-shadow:
              0 0 15px rgba(255, 255, 255, 0.8), /* Brillance blanche plus intense */
              0 0 25px rgba(255, 223, 0, 0.8),
              0 0 35px rgba(255, 223, 0, 0.6),
              0 0 45px rgba(255, 215, 0, 0.5),
              0 0 55px rgba(255, 215, 0, 0.4); /* Lueur néon dorée étendue */
            transform: scale(1.2); /* Légère augmentation de taille */
          }

          /* Keyframes pour l'effet de rotation de la bordure */
          @keyframes rotating-border {
            0% {
              clip-path: inset(0 100% 0 0);
            }
            25% {
              clip-path: inset(0 0 100% 0);
            }
            50% {
              clip-path: inset(0 0 0 100%);
            }
            75% {
              clip-path: inset(100% 0 0 0);
            }
            100% {
              clip-path: inset(0 100% 0 0);
            }
          }

          /* Effet lumineux tournant et dynamique autour de l'encadré */
          .rotating-border-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-radius: 0.5rem;
            box-shadow: 0 0 15px 8px rgba(255, 223, 0, 0.7); /* Lueur dorée de base */
            border-image: linear-gradient(45deg, #FFD700, #FFFFFF, #FFD700) 1;
            animation: rotating-border 3s linear infinite, intense-glow 1.5s ease-in-out infinite;
            pointer-events: none;
          }

          /* Animation pour brillance intermittente */
          @keyframes intense-glow {
            0%, 100% {
              box-shadow: 0 0 15px 8px rgba(255, 223, 0, 0.7);
            }
            50% {
              box-shadow: 0 0 25px 15px rgba(255, 255, 255, 1); /* Flash de brillance blanche */
            }
          }

          /* Effet de zoom au survol pour l'encadré */
          .hover-effect:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease-in-out;
          }
          .hover-effect {
            transition: transform 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default APropos;

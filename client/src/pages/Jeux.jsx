import React from "react";

const Jeux = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-6 md:px-12 lg:px-24">
      {/* Titre principal de la page */}
      <h1 className="text-4xl lg:text-5xl font-bold text-yellow-400 text-center mb-8">
        Les Jeux créés par mon frère.
      </h1>

      {/* Description de la passion pour le développement de jeux */}
      <div className="max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed mb-12 text-center">
        <p>
          Bienvenue dans l'univers des jeux créés par mon frère. Véritable
          passionné de développement, il consacre son talent à la création de
          jeux vidéo uniques et immersifs. Découvrez ses créations et plongez
          dans des aventures originales qui captivent les joueurs.
        </p>
      </div>

      {/* Section de redirection vers Epic Games */}
      <div className="relative bg-gray-800 py-8 px-6 rounded-lg shadow-lg max-w-2xl mx-auto text-center overflow-hidden rotating-border-container hover-effect">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
          Soutenez un créateur de jeux prometteur !
        </h2>
        <p className="text-lg">
          Si vous êtes curieux de découvrir ses jeux, n'hésitez pas à visiter sa
          page sur Epic Games. Vous pourrez explorer ses mondes virtuels et
          apprécier son travail en tant que créateur de jeux vidéo. Rejoignez
          l'aventure et soutenez un talent en pleine croissance !
        </p>

        {/* Bouton vers Epic Games avec effet d’animation constant et lumière néon */}
        <div className="flex justify-center mt-8">
          <a
            href="https://store.epicgames.com/fr/browse?q=hapc&sortBy=relevancy&sortDir=DESC&count=40"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-lg font-semibold text-gray-900 rounded-full transition-transform duration-500 gradient-button neon-effect"
          >
            Voir les jeux sur Epic Games
          </a>
        </div>
      </div>

      {/* CSS personnalisé pour les animations */}
      <style>
        {`
          /* Effet de lumière tournante autour de l'encadré */
          .rotating-border-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-radius: 0.5rem;
            box-shadow: 0 0 15px 8px rgba(255, 223, 0, 0.7);
            border-image: linear-gradient(45deg, #FFD700, #FFFFFF, #FFD700) 1;
            animation: rotating-border 3s linear infinite, intense-glow 1.5s ease-in-out infinite;
            pointer-events: none;
          }

          /* Keyframes pour la rotation de la bordure */
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

          /* Brillance intermittente pour la bordure */
          @keyframes intense-glow {
            0%, 100% {
              box-shadow: 0 0 15px 8px rgba(255, 223, 0, 0.7);
            }
            50% {
              box-shadow: 0 0 25px 15px rgba(255, 255, 255, 1);
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

          /* Effet dynamique pour le bouton */
          .gradient-button {
            background: linear-gradient(90deg, #FFD700, #FFC700, #FFD700);
            background-size: 200% 200%;
            color: #000; /* Texte noir pour contraste */
            animation: gradient-move 3s ease-in-out infinite, pulsate 1.5s ease-in-out infinite;
          }

          /* Animation de dégradé dynamique */
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          /* Animation pulsante pour le bouton */
          @keyframes pulsate {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          /* Effet néon autour du bouton */
          .neon-effect {
            box-shadow: 
              0 0 10px rgba(255, 215, 0, 0.8), /* Couche néon dorée proche */
              0 0 20px rgba(255, 215, 0, 0.6), /* Couche néon dorée intermédiaire */
              0 0 30px rgba(255, 215, 0, 0.5); /* Couche néon dorée éloignée */
          }
        `}
      </style>
    </div>
  );
};

export default Jeux;

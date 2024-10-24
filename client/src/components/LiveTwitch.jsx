import React from "react";

function LiveTwitch() {
  return (
    <div className="bg-purple-800 bg-opacity-60 p-6 rounded-md text-center text-white my-8 neon-box">
      <h2 className="text-4xl font-bold mb-2 neon-text">
        Rejoignez l'Aventure Live
      </h2>
      <p className="mb-4">
        Rejoignez le stream de KOD_ElDragon en direct maintenant !
      </p>
      <div className="mt-4 flex justify-center">
        {" "}
        {/* Iframe Twitch pour afficher le stream directement sur le site */}
        <iframe
          src="https://player.twitch.tv/?channel=kod_eldragon&parent=localhost"
          height="300"
          width="40%"
          allowFullScreen={true}
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
      <a
        href="https://www.twitch.tv/kod_eldragon"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-shadow shadow-lg neon-glow inline-block"
      >
        Regarder en Direct sur Twitch
      </a>
    </div>
  );
}

export default LiveTwitch;

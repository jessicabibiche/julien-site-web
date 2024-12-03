import React from "react";

function LiveTwitch() {
  return (
    <div className="bg-black p-8 rounded-lg flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Section Texte */}
      <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
        <h2
          className="text-5xl font-bold mb-4"
          style={{
            fontFamily: "'Noto Serif JP', serif",
            color: "white",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
          }}
        >
          Rejoignez l'Aventure Live
        </h2>
        <p className="text-lg text-white mb-4">
          Rejoignez le stream de KOD_ElDragon en direct maintenant !
        </p>
        <a
          href="https://www.twitch.tv/kod_eldragon"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-400 transition-shadow shadow-lg animate-pulse"
          style={{ textShadow: "2px 2px 5px black" }}
        >
          {" "}
          Regarder en Direct sur Twitch
        </a>
      </div>

      {/* Section Vidéo Twitch */}
      <div
        className="w-full lg:w-1/2 flex justify-center items-center"
        style={{
          position: "relative",
          borderRadius: "12px",
        }}
      >
        {/* Contour lumineux */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: "3px solid transparent",
            backgroundImage:
              "linear-gradient(black, black), linear-gradient(90deg, #8A2BE2, #FFD700)",
            backgroundOrigin: "border-box",
            backgroundClip: "content-box, border-box",
            boxShadow: "0 0 20px 10px rgba(138, 43, 226, 0.6)",
          }}
        ></div>

        {/* Iframe Twitch */}
        <iframe
          src="https://player.twitch.tv/?channel=kod_eldragon&parent=localhost"
          height="300"
          width="100%"
          allowFullScreen={true}
          frameBorder="0"
          scrolling="no"
          className="rounded-lg z-10"
        ></iframe>
      </div>
    </div>
  );
}

export default LiveTwitch;

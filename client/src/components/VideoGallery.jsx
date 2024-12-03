import React, { useState, useEffect } from "react";
import axios from "axios";

function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const CHANNEL_ID = "UCsg7p4fWiwCLULpQw_-RrCg";
  const MAX_RESULTS = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/youtube?channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}`
        );

        const videoItems = response.data.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        }));

        setVideos(videoItems);
      } catch (error) {
        console.error("Erreur lors de la récupération des vidéos", error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="bg-black p-8">
      {/* Titre aligné à gauche */}
      <h2
        className="text-4xl mb-6 text-left"
        style={{
          fontFamily: "'Noto Serif JP', serif",
          letterSpacing: "-2px",
          color: "white",
          textShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
        }}
      >
        Nos nouvelles vidéos
      </h2>

      {/* Grille des vidéos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative group p-4 rounded-lg overflow-hidden transform transition-transform hover:scale-105"
            style={{
              position: "relative",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              backgroundColor: "black",
              borderRadius: "12px",
            }}
          >
            {/* Contour lumineux */}
            <div
              className="absolute inset-0 z-0 rounded-lg pointer-events-none"
              style={{
                border: "3px solid transparent",
                backgroundImage:
                  "linear-gradient(black, black), linear-gradient(90deg, #FFD700, #FFFFFF, #FFD700)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
                transition: "box-shadow 0.3s ease-in-out",
              }}
            ></div>

            {/* Image de la vidéo */}
            <div className="relative z-10">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-36 object-cover rounded-lg"
              />
              {/* Icône Play */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleVideoClick(video.videoUrl)}
                  className="bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.9)",
                  }}
                >
                  {/* Flèche blanche avec contour noir */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="black"
                    strokeWidth="1"
                    className="w-6 h-6"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Titre de la vidéo */}
            <h3
              className="text-white text-center text-sm mt-2 z-20 relative"
              style={{
                fontFamily: "'Noto Serif JP', serif",
              }}
            >
              {video.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal vidéo plein écran */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 p-6 rounded-lg">
            <button
              onClick={handleCloseVideo}
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Fermer
            </button>
            <iframe
              width="560"
              height="315"
              src={selectedVideo}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 md:w-[560px] md:h-[315px] rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoGallery;

import React, { useState, useEffect } from "react";
import axios from "axios";

function VideoGallery() {
  const [videos, setVideos] = useState([]);

  const CHANNEL_ID = "UCsg7p4fWiwCLULpQw_-RrCg";
  const MAX_RESULTS = 5; // Afficher uniquement 5 vidéos

  // Tableau contenant les images personnalisées
  const customImages = [
    "/images/kod1.png",
    "/images/kod2.png",
    "/images/kod3.png",
    "/images/kod4.png",
    "/images/kod5.png",
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/youtube?channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}`
        );

        // Assigner les images dans l'ordre aux cinq dernières vidéos
        const videoItems = response.data.map((item, index) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          // Assigner les images en fonction de l'ordre des vidéos (jusqu'à 5 images personnalisées)
          thumbnail: customImages[index] || item.snippet.thumbnails.default.url,
          videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        }));

        setVideos(videoItems);
      } catch (error) {
        console.error("Erreur lors de la récupération des vidéos", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="bg-black p-8">
      <h2 className="text-white text-3xl mb-6">Nos nouvelles vidéos</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative group bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 text-black px-4 py-2 rounded-full"
              >
                Regarder la Vidéo
              </a>
            </div>
            <h3 className="text-white text-lg mt-4">{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoGallery;

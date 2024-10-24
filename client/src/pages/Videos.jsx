import React, { useState, useEffect } from "react";
import axios from "axios";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const CHANNEL_ID = "UCsg7p4fWiwCLULpQw_-RrCg";

  // Tableau contenant les images personnalisées
  const customImages = [
    "/images/kod1.png",
    "/images/kod2.png",
    "/images/kod3.png",
    "/images/kod4.png",
    "/images/kod5.png",
  ];

  // Fonction pour sélectionner une image aléatoirement
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * customImages.length);
    return customImages[randomIndex];
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/youtube?channelId=${CHANNEL_ID}&maxResults=50`
        );

        const videoItems = response.data.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          // Sélectionne une image aléatoire pour chaque vidéo
          thumbnail: getRandomImage() || item.snippet.thumbnails.default.url,
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
      <h2 className="text-white text-3xl mb-6">Toutes nos vidéos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative group bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            onClick={() => handleVideoClick(video.videoUrl)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-full">
                Regarder la Vidéo
              </button>
            </div>
            <h3 className="text-white text-lg mt-4">{video.title}</h3>
          </div>
        ))}
      </div>

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

export default Videos;

import axios from "axios";

export const getVideos = async (req, res) => {
  const { channelId, maxResults } = req.query;

  // Clé API YouTube stockée dans les variables d'environnement
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;

  try {
    const response = await axios.get(YOUTUBE_API_URL);
    res.status(200).json(response.data.items);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des vidéos",
      error: error.message,
    });
  }
};

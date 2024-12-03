import axios from "axios";

export const getVideos = async (req, res) => {
  const { channelId, maxResults } = req.query;

  if (!channelId || !maxResults) {
    return res.status(400).json({
      message: "Les paramètres 'channelId' et 'maxResults' sont requis.",
    });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({
      message:
        "Clé API YouTube manquante. Assurez-vous que YOUTUBE_API_KEY est définie.",
    });
  }

  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;

  try {
    const response = await axios.get(YOUTUBE_API_URL);
    res.status(200).json(response.data.items);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des vidéos",
      error: error.response?.data || error.message,
    });
  }
};

import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] || // Vérifie l'en-tête Authorization
    req.cookies.token; // Vérifie les cookies

  if (!token) {
    return res.status(401).json({ message: "Pas de token fourni !" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Accès non autorisé !" });
  }
};

export default authenticateUser;

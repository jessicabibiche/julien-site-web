import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config.js";
import "express-async-errors";
import notFound from "./middlewares/not-foundmiddlewares.js";
import errorHandler from "./middlewares/error-handlemiddle.js";
import connectDB from "./config/db.config.js";
import { auth } from "./features/auth/index.js";
import profileRoutes from "./features/profile/profile.route.js";
import youtubeRoutes from "./features/youtube/youtube.route.js";
import contactRoutes from "./features/contact/contact.route.js";
import donationRoutes from "./features/donations/donations.route.js";
import userRoutes from "./features/users/users.route.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";
import avatarRoutes from "./features/avatars/avatar.routes.js";
import cookieParser from "cookie-parser";
import editProfileRoutes from "./features/editProfile/editProfile.route.js";
// Récupération des chemins corrects dans ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

const app = express();

// Connexion à la base de données
connectDB();

import morgan from "morgan";
app.use(morgan("dev"));

// Configuration des middlewares
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(mongoSanitize());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.static("dist"));

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/avatars", avatarRoutes);

// Routes
app.get("/", (_req, res) => {
  res.status(200).send("<h1>API</h1><a href='/api-docs'>Documentation</a>");
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/youtube", youtubeRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/edit-profile", editProfileRoutes);

// Middleware pour gérer les routes non trouvées et les erreurs
app.use(notFound);
app.use(errorHandler);

export default app;

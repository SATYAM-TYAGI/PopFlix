import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Router from "./routes/LoginRoutes.js";
import movieRouter from "./routes/MovieRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express app setup - exported for tests also
export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // poster images served from backend/data/images
  app.use("/data/images", express.static(path.join(__dirname, "data", "images")));

  app.use("/api/auth", Router);
  app.use("/api/movies", movieRouter);

  // quick check in browser - lists api urls
  app.get("/", (req, res) => {
    res.json({
      message: "PopFlix API is running",
      routes: {
        movies: "/api/movies",
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
    });
  });

  // common mistake - people hit /movies instead of /api/movies
  app.get("/movies", (req, res) => {
    res.redirect("/api/movies");
  });

  return app;
};

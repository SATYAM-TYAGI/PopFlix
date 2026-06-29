import express from "express";
import moviesData from "../data/movies.js";

const movieRouter = express.Router();

// returns all movies from data/movies.js
movieRouter.get("/", (req, res) => {
  res.status(200).json(moviesData);
});

export default movieRouter;

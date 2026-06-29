import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [moviesError, setMoviesError] = useState(null);

  // backend poster paths need full url prepended
  const withAbsoluteImageUrls = (items) =>
    items.map((movie) => ({
      ...movie,
      poster: movie.poster?.startsWith("/data/images")
        ? `${API_BASE_URL}${movie.poster}`
        : movie.poster,
      backdrop: movie.backdrop?.startsWith("/data/images")
        ? `${API_BASE_URL}${movie.backdrop}`
        : movie.backdrop,
    }));

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/movies`);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid movies response");
        setMovies(withAbsoluteImageUrls(data));
        setMoviesError(null);
      } catch (error) {
        console.error("Failed to load movies from API:", error);
        setMovies([]);
        setMoviesError(error.message || "Failed to load movies");
      } finally {
        setIsLoadingMovies(false);
      }
    };

    loadMovies();
  }, []);

  return { movies, isLoadingMovies, moviesError };
};

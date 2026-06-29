// filter movies by search text
export const filterMoviesBySearch = (movies, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return movies;

  return movies.filter((movie) => {
    const haystack = `${movie.title} ${movie.genre} ${movie.cast} ${movie.director}`.toLowerCase();
    return haystack.includes(q);
  });
};

// group movies genre wise for categories page
export const groupMoviesByGenre = (movies) => {
  const grouped = {};

  movies.forEach((movie) => {
    if (!grouped[movie.genre]) grouped[movie.genre] = [];
    grouped[movie.genre].push(movie);
  });

  return Object.entries(grouped)
    .map(([genre, items]) => ({
      genre,
      count: items.length,
      cover: items[0].poster,
      movies: items,
    }))
    .sort((a, b) => a.genre.localeCompare(b.genre));
};

// imdb ratings are /10
export const formatRating = (rating) => `${rating}/10`;

// star fill for detail page (5 stars mapped from /10)
export const getStarFillCount = (rating) => {
  const num = Number(rating);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(5, Math.round(num / 2)));
};

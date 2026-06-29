import { useEffect, useMemo, useRef, useState } from "react";
import { filterMoviesBySearch, formatRating } from "../utils/movieUtils.js";

const SearchBar = ({ movies, onMovieSelect, inputClassName = "" }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const results = useMemo(() => filterMoviesBySearch(movies, query), [movies, query]);
  const showDropdown = isOpen && query.trim().length > 0;

  // close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (movie) => {
    setQuery("");
    setIsOpen(false);
    onMovieSelect?.(movie);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className={inputClassName || "bg-white text-black text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none w-[150px] lg:w-[250px]"}
      />

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl z-50 max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No results found</p>
          ) : (
            results.map((movie) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => handleSelect(movie)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 text-left"
              >
                <img src={movie.poster} alt={movie.title} className="w-8 h-12 object-cover rounded-sm shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{movie.title}</div>
                  <div className="text-xs text-gray-400">
                    {movie.genre} · {formatRating(movie.rating)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

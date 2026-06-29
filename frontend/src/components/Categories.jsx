import { useEffect, useMemo, useState } from "react";
import { useMovies } from "../hooks/useMovies.js";
import { API_BASE_URL } from "../config/api.js";
import LogoIcon from "./LogoIcon.jsx";
import SearchBar from "./SearchBar.jsx";
import { formatRating, groupMoviesByGenre } from "../utils/movieUtils.js";

const Categories = ({ onViewChange, onMovieClick, isGuest = false }) => {
  const { movies } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({ username: "Loading...", password: "Loading..." });
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = useMemo(() => groupMoviesByGenre(movies), [movies]);

  const selectedMovies = useMemo(() => {
    if (!selectedGenre) return [];
    return movies.filter((movie) => movie.genre === selectedGenre);
  }, [movies, selectedGenre]);

  useEffect(() => {
    const shouldFetchProfile = isProfileOpen || isMobileProfileOpen;
    if (!isGuest && shouldFetchProfile && profileData.username === "Loading...") {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.name) {
              setProfileData({ username: data.name, password: data.password });
            } else {
              setProfileData({ username: "Not Found", password: "Not Found" });
            }
          })
          .catch((err) => {
            console.error("Failed to fetch profile:", err);
            setProfileData({ username: "Error", password: "Error" });
          });
      }
    }
  }, [isGuest, isProfileOpen, isMobileProfileOpen, profileData.username]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/signup";
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(`${isLoginMode ? "Login" : "Signup"} successful!`);
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          window.location.reload();
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    if (isGuest) {
      alert("Please Login/Sign Up to view details");
      return;
    }
    onMovieClick?.(movie);
  };

  const handleSearchSelect = (movie) => {
    if (isGuest) {
      alert("Please Login/Sign Up to view details");
      return;
    }
    onMovieClick?.(movie);
  };

  const handleHomeClick = () => {
    onViewChange?.(isGuest ? "dashboard" : "dashboard");
  };

  const renderMovieGrid = (movieList) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {movieList.map((movie) => (
        <div
          key={movie.id}
          className="relative group rounded-lg overflow-hidden aspect-[2/3] cursor-pointer"
          onClick={() => handleMovieSelect(movie)}
        >
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-lg font-bold mb-1 truncate">{movie.title}</h3>
            <div className="flex items-center text-sm">
              <span className="text-[#f3c669] mr-1">★</span>
              <span>{formatRating(movie.rating)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden">
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 border-b border-white/10 relative z-20 bg-[#0a0a0a]">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <span className="text-xl md:text-2xl font-bold tracking-tight">PopFlix</span>
            <LogoIcon />
          </div>
          <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <li className="hover:text-white transition-colors cursor-pointer" onClick={handleHomeClick}>Home</li>
            <li className="text-[#f3c669] font-medium cursor-pointer">Categories</li>
            <li
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => (isGuest ? alert("Please Login/Sign Up") : onViewChange?.("mylist"))}
            >
              My List
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:block">
            <SearchBar movies={movies} onMovieSelect={handleSearchSelect} />
          </div>

          {isGuest ? (
            <div className="relative">
              <button
                onClick={() => setIsLoginPopupOpen(!isLoginPopupOpen)}
                className="bg-[#f3c669] text-black text-sm font-medium px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#e0b55c] transition-colors"
              >
                <span className="hidden sm:inline">Login/Sign Up</span>
                <span className="sm:hidden">Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isLoginPopupOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLoginPopupOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-[#1a1a1a] rounded-xl p-6 shadow-2xl border border-white/10 z-50">
                  <div className="flex p-1 bg-black rounded-full mb-6">
                    <button
                      onClick={() => setIsLoginMode(true)}
                      className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${isLoginMode ? "bg-[#f3c669] text-black" : "text-gray-400 hover:text-white"}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsLoginMode(false)}
                      className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${!isLoginMode ? "bg-[#f3c669] text-black" : "text-gray-400 hover:text-white"}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full bg-white text-black px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#f3c669]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white text-black px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#f3c669]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#f3c669] text-black font-medium py-2.5 rounded-md mt-6 hover:bg-[#e0b55c] transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : isLoginMode ? "Login" : "Sign Up"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full border border-[#f3c669] text-[#f3c669] flex items-center justify-center hover:bg-[#f3c669]/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-[#1e1e1e] border border-white/10 p-6 shadow-2xl z-50 rounded-md">
                  <h3 className="text-[#f3c669] text-xl font-medium mb-6">My Profile</h3>

                  <div className="mb-4">
                    <div className="text-[#f3c669] text-xs mb-1">Username</div>
                    <div className="text-white text-sm font-medium">{profileData.username}</div>
                  </div>

                  <div className="mb-8">
                    <div className="text-[#f3c669] text-xs mb-1">Password</div>
                    <div className="text-white text-sm font-medium">{profileData.password}</div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full bg-[#f3c669] text-black font-bold py-2.5 rounded-md hover:bg-[#e0b55c] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden text-white hover:text-[#f3c669] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
          <div className="px-6 py-6 pb-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">PopFlix</span>
                <LogoIcon size="sm" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-8">
              <SearchBar
                movies={movies}
                onMovieSelect={(movie) => {
                  setIsMobileMenuOpen(false);
                  handleSearchSelect(movie);
                }}
                inputClassName="bg-white text-black text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none w-full"
              />
            </div>

            <ul className="flex flex-col gap-6 text-2xl font-medium text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); handleHomeClick(); }}>Home</li>
              <li className="text-[#f3c669] cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Categories</li>
              <li
                className="hover:text-white transition-colors cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isGuest) alert("Please Login/Sign Up");
                  else onViewChange?.("mylist");
                }}
              >
                My List
              </li>
              {!isGuest && (
                <li className="cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setIsMobileProfileOpen((prev) => !prev)}
                    className={`w-full flex items-center gap-2 transition-colors ${isMobileProfileOpen ? "text-[#f3c669]" : "hover:text-white"}`}
                  >
                    <span>My Profile</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isMobileProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMobileProfileOpen && (
                    <div className="mt-3 text-base space-y-1">
                      <div className="text-[#f3c669] font-semibold">Username</div>
                      <div className="text-white">{profileData.username}</div>
                      <div className="text-[#f3c669] font-semibold mt-3">Password</div>
                      <div className="text-white">{profileData.password}</div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>

          <div className="bg-[#333333] flex-1 px-8 py-10 flex flex-col items-center justify-end">
            {isGuest ? (
              <form className="w-full max-w-[250px] space-y-4" onSubmit={handleSubmit}>
                <div className="flex p-1 border border-[#f3c669] rounded-full mb-2 w-full">
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${isLoginMode ? "bg-[#f3c669] text-black" : "text-gray-300 hover:text-white"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${!isLoginMode ? "bg-[#f3c669] text-black" : "text-gray-300 hover:text-white"}`}
                  >
                    Sign Up
                  </button>
                </div>
                <div>
                  <label className="block text-[#f3c669] text-xs font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-white text-black px-3 py-1.5 rounded-sm outline-none focus:ring-2 focus:ring-[#f3c669]"
                  />
                </div>
                <div>
                  <label className="block text-[#f3c669] text-xs font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white text-black px-3 py-1.5 rounded-sm outline-none focus:ring-2 focus:ring-[#f3c669]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f3c669] hover:bg-[#e0b55c] transition-colors text-black font-bold py-2 text-sm rounded-md disabled:opacity-50"
                >
                  {isLoading ? "..." : isLoginMode ? "Login" : "Sign Up"}
                </button>
              </form>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full max-w-[250px] bg-[#f3c669] hover:bg-[#e0b55c] transition-colors text-black font-bold py-2 text-sm rounded-md"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      <section className="px-4 md:px-10 py-10 md:py-16 border-b border-white/10">
        {selectedGenre ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              className="flex items-center gap-2 text-[#f3c669] hover:text-[#e0b55c] transition-colors mb-8 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </button>
            <h2 className="text-2xl font-bold mb-10">{selectedGenre}</h2>
            {selectedMovies.length > 0 ? (
              renderMovieGrid(selectedMovies)
            ) : (
              <p className="text-gray-400">No movies found in this category.</p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-10">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div
                  key={category.genre}
                  className="relative group rounded-lg overflow-hidden aspect-[2/3] cursor-pointer border border-transparent hover:border-[#f3c669]/50"
                  onClick={() => setSelectedGenre(category.genre)}
                >
                  <img src={category.cover} alt={category.genre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-lg font-bold mb-1">{category.genre}</h3>
                    <p className="text-sm text-[#f3c669]">{category.count} movies</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Categories;

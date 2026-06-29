import { useState, useEffect, useMemo } from 'react';
import { useMovies } from '../hooks/useMovies.js';
import { API_BASE_URL } from '../config/api.js';
import LogoIcon from './LogoIcon.jsx';
import { formatRating } from '../utils/movieUtils.js';

const MyList = ({ onViewChange }) => {
  // fav movie ids stored in browser localStorage
  const [favoriteMovieIds, setFavoriteMovieIds] = useState(() =>
    JSON.parse(localStorage.getItem('myList') || '[]')
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({ username: 'Loading...', password: 'Loading...' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { movies } = useMovies();

  // profile fetch when desktop or mobile profile opens
  useEffect(() => {
    const shouldFetchProfile = isProfileOpen || isMobileProfileOpen;
    if (shouldFetchProfile && profileData.username === 'Loading...') {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setProfileData({ username: data.name, password: data.password });
          } else {
            setProfileData({ username: 'Not Found', password: 'Not Found' });
          }
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
          setProfileData({ username: 'Error', password: 'Error' });
        });
      }
    }
  }, [isProfileOpen, isMobileProfileOpen, profileData.username]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.reload();
  };

  // filter movies that user saved
  const myMovies = useMemo(
    () => movies.filter((movie) => favoriteMovieIds.includes(movie.id)),
    [movies, favoriteMovieIds]
  );

  const removeFromList = (id) => {
    // remove id and update localStorage
    const updatedFavs = favoriteMovieIds.filter((favId) => favId !== id);
    localStorage.setItem('myList', JSON.stringify(updatedFavs));
    setFavoriteMovieIds(updatedFavs);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 border-b border-white/10 relative z-20 bg-[#0a0a0a]">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange && onViewChange('dashboard')}>
            <span className="text-xl md:text-2xl font-bold tracking-tight">PopFlix</span>
            <LogoIcon />
          </div>
          <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onViewChange && onViewChange('dashboard')}>Home</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onViewChange && onViewChange('categories')}>Categories</li>
            <li className="text-[#f3c669] font-medium cursor-pointer">My List</li>
          </ul>
        </div>
        
        {/* Profile icon */}
        <div className="flex items-center gap-4 md:gap-6">
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
          
          <button 
            className="md:hidden text-white hover:text-[#f3c669] transition-colors ml-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Full Screen) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
          <div className="px-6 py-6 pb-12">
            <div className="flex justify-between items-center mb-12">
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
            <ul className="flex flex-col gap-6 text-2xl font-medium text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); setIsMobileProfileOpen(false); onViewChange && onViewChange('dashboard'); }}>Home</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); setIsMobileProfileOpen(false); onViewChange && onViewChange('categories'); }}>Categories</li>
              <li className="text-[#f3c669] cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>My List</li>
              <li className="cursor-pointer">
                <button
                  type="button"
                  onClick={() => setIsMobileProfileOpen((prev) => !prev)}
                  className={`w-full flex items-center gap-2 transition-colors ${isMobileProfileOpen ? 'text-[#f3c669]' : 'hover:text-white'}`}
                >
                  <span>My Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isMobileProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </ul>
          </div>
          
          {/* Bottom Section */}
          <div className="bg-[#333333] flex-1 px-8 py-10 flex flex-col items-center justify-end">
            <button 
              onClick={handleSignOut}
              className="w-full max-w-[250px] bg-[#f3c669] hover:bg-[#e0b55c] transition-colors text-black font-bold py-2 text-sm rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* My List Content */}
      <section className="px-4 md:px-10 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">My List</h2>
        
        {myMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p className="text-lg">Your list is empty.</p>
            <p className="text-sm mt-2">Explore movies and add them to your list!</p>
            <button 
              onClick={() => onViewChange && onViewChange('dashboard')}
              className="mt-6 bg-[#f3c669] text-black font-medium px-6 py-2 rounded-md hover:bg-[#e0b55c] transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {myMovies.map((movie) => (
              <div key={movie.id} className="relative group rounded-lg overflow-hidden aspect-[2/3]">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromList(movie.id)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-red-600/80 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all text-white"
                  title="Remove from My List"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-bold mb-1 truncate">{movie.title}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-[#f3c669] mr-1">★</span>
                    <span>{formatRating(movie.rating)}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-300">{movie.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyList;

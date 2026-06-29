import { useState, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies.js';
import { API_BASE_URL } from '../config/api.js';
import LogoIcon from './LogoIcon.jsx';
import Categories from './Categories.jsx';
import SearchBar from './SearchBar.jsx';
import { formatRating } from '../utils/movieUtils.js';

const Home = () => {
  const [activePage, setActivePage] = useState('home');
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(4);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { movies } = useMovies();
  const heroImages = movies.slice(0, 4).map((movie) => movie.poster);
  const minimumDisplayCount = 4; // default cards shown before load more

  // login/signup form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`${isLoginMode ? 'Login' : 'Signup'} successful!`);
        if (data.token) {
          // save token and reload to show dashboard
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          window.location.reload();
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // autoscroll hero every 3 sec
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handlePrevImage = () => {
    setCurrentHeroImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextImage = () => {
    setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  if (activePage === 'categories') {
    return <Categories isGuest onViewChange={(view) => view === 'dashboard' ? setActivePage('home') : setActivePage(view)} />;
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 border-b border-white/10 relative">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight">PopFlix</span>
            <LogoIcon />
          </div>
          <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <li className="text-[#f3c669] font-medium cursor-pointer" onClick={() => setActivePage('home')}>Home</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActivePage('categories')}>Categories</li>
            <li className="hover:text-white transition-colors cursor-pointer">My List</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:block">
            <SearchBar
              movies={movies}
              onMovieSelect={() => alert('Please Login/Sign Up to view details')}
              inputClassName="bg-white text-black text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none w-[200px] lg:w-[250px]"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsLoginPopupOpen(!isLoginPopupOpen)}
              className="bg-[#f3c669] text-black text-sm font-medium px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#e0b55c] transition-colors"
            >
              <span className="hidden sm:inline">Login/Sign Up</span>
              <span className="sm:hidden">Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isLoginPopupOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Login Popup */}
            {isLoginPopupOpen && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-[#1a1a1a] rounded-xl p-6 shadow-2xl border border-white/10 z-50">
                <div className="flex p-1 bg-black rounded-full mb-6">
                  <button 
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${isLoginMode ? 'bg-[#f3c669] text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${!isLoginMode ? 'bg-[#f3c669] text-black' : 'text-gray-400 hover:text-white'}`}
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
                    {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
                  </button>
                </form>
              </div>
            )}
          </div>
          
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

      {/* Mobile Menu (Full Screen) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          {/* Top Section */}
          <div className="bg-[#0a0a0a] px-6 py-6 pb-12">
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
              <li className="text-[#f3c669] cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); setActivePage('home'); }}>Home</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); setActivePage('categories'); }}>Categories</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>My List</li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="bg-[#333333] flex-1 px-8 py-10 flex flex-col items-center">
            {/* Toggle */}
            <div className="flex p-1 border border-[#f3c669] rounded-full mb-10 w-[200px]">
              <button 
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${isLoginMode ? 'bg-[#f3c669] text-black' : 'text-gray-300 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${!isLoginMode ? 'bg-[#f3c669] text-black' : 'text-gray-300 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
            
            <form className="w-full max-w-[250px] space-y-4" onSubmit={handleSubmit}>
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
              <div className="pt-6 flex justify-center">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#f3c669] text-black font-bold text-xs py-2 px-8 rounded-sm hover:bg-[#e0b55c] transition-colors disabled:opacity-50"
                >
                  {isLoading ? '...' : (isLoginMode ? 'Login' : 'Sign Up')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-white/10">
        <div className="max-w-xl w-full">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Stream the<br />Best of Cinema
          </h1>
          <p className="text-[#f3c669] text-sm md:text-base leading-relaxed mb-8 md:mb-12 max-w-sm">
            Access a curated selection of top-rated movies, exclusive premieres, and hidden gems. Elevate your viewing experience with high-definition streaming and personalized recommendations.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">250+</div>
              <div className="text-[#f3c669] text-xs">Movies available</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">450K+</div>
              <div className="text-[#f3c669] text-xs">People subscribed</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">200K+</div>
              <div className="text-[#f3c669] text-xs">Top review</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-[300px] h-[450px] rounded-lg overflow-hidden relative shadow-2xl shadow-black/50">
            <img
              src={heroImages[currentHeroImageIndex]}
              alt="Hero Movie"
              className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
              onClick={() => setIsLoginPopupOpen(true)}
            />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handlePrevImage} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {heroImages.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${currentHeroImageIndex === index ? 'bg-[#f3c669]' : 'bg-gray-600'}`}
                ></div>
              ))}
            </div>
            <button onClick={handleNextImage} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* New Release Section */}
      <section className="px-4 md:px-10 py-10 md:py-16 border-b border-white/10">
        <h2 className="text-2xl font-bold mb-10">New Release</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {movies.slice(0, displayCount).map(movie => (
            <div key={movie.id} className="relative group rounded-lg overflow-hidden aspect-[2/3] cursor-pointer" onClick={() => alert("Please Login/Sign Up to view details")}> {/* guest user - login required */}
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
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
        
        <div className="flex justify-center gap-3 flex-wrap">
          {displayCount < movies.length && (
            <button 
              onClick={() => setDisplayCount(prev => prev + 4)}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors text-sm font-medium px-6 py-3 rounded-md flex items-center gap-2 text-gray-300 border border-white/5"
            >
              LOAD MORE MOVIES
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          {displayCount > minimumDisplayCount && (
            <button
              onClick={() => setDisplayCount(minimumDisplayCount)}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors text-sm font-medium px-6 py-3 rounded-md flex items-center gap-2 text-gray-300 border border-white/5"
            >
              SHOW LESS
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Top 3 Movies Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 border-b border-white/10 overflow-hidden">
        <h2 className="text-2xl font-bold mb-10 md:mb-16">Top 3 Movies</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-20">
          {movies.slice(0, 3).map((movie, index) => (
            <div
              key={movie.id}
              className="relative w-full max-w-[200px] aspect-[2/3] cursor-pointer"
              onClick={() => setIsLoginPopupOpen(true)}
            >
              <span 
                className="absolute -left-6 md:-left-16 -top-8 text-[150px] md:text-[250px] font-bold text-transparent leading-none"
                style={{ 
                  WebkitTextStroke: '2px #f3c669',
                  zIndex: 0
                }}
              >
                {index + 1}
              </span>
              <img 
                src={movie.poster} 
                alt={`Top ${index + 1}`} 
                className="w-full h-full object-cover relative z-10 shadow-xl rounded-sm"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer / CTA Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[400px] relative overflow-hidden">
        <div className="max-w-xl relative z-10 w-full text-center md:text-left pb-20 md:pb-0">
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-6">
            From blockbuster hits to hidden gems, we've got a movie for every taste. Continue browsing to find your perfect match.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 md:top-0 w-full md:w-1/2 flex justify-center md:justify-end items-end md:items-center pointer-events-none opacity-50 md:opacity-100">
          <img 
            src="/popcorn_img4.png" 
            alt="Popcorn" 
            className="w-[300px] md:w-[800px] object-contain md:translate-x-1/4 md:translate-y-10 md:scale-125"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;

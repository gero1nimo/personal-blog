import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../services/api';

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Fetch profile data from backend
    const fetchProfile = async () => {
      try {
        const data = await profileApi.get();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const navLinks = [
    { to: '/about', label: 'About me' },
    { to: '/#skills', label: 'Skills' },
    { to: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-200"></div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-3 bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-gray-600 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 animate-fade-in">
          {navLinks.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-3xl font-light tracking-wider hover:text-gray-400 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all hover:scale-105"
          >
            CONTACT ME
          </a>
        </div>
      )}

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Side - Dark Grey */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-0 min-h-[60vh] md:min-h-screen">
          {/* Minimalist Logo */}
          <div className={`absolute top-8 left-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 border border-white/80 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
                <span className="text-white font-bold text-sm group-hover:text-black transition-colors">MA</span>
              </div>
              <span className="text-gray-500 text-xs tracking-widest hidden md:block">DEVELOPER</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-20 md:mt-0">
            <p className={`text-gray-400 text-sm md:text-base mb-3 font-light tracking-[0.3em] uppercase ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
              Hi, I am
            </p>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 tracking-tight leading-none ${isLoaded ? 'animate-slide-in-left animation-delay-200' : 'opacity-0'}`}>
              Mehmet
              <span className="block gradient-text-accent">Akif</span>
            </h1>
            <div className={`flex items-center gap-4 mb-8 ${isLoaded ? 'animate-slide-in-left animation-delay-400' : 'opacity-0'}`}>
              <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <p className="text-gray-400 text-sm md:text-base font-light tracking-wide">
                Backend Developer & DevOps Enthusiast
              </p>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 mb-10 ${isLoaded ? 'animate-slide-in-left animation-delay-600' : 'opacity-0'}`}>
              <div className="group">
                <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {profile?.years_experience || 3}+
                </div>
                <div className="text-gray-500 text-xs tracking-wider uppercase">Years Exp</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  {profile?.projects_count || 15}+
                </div>
                <div className="text-gray-500 text-xs tracking-wider uppercase">Projects</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-pink-400 transition-colors">100%</div>
                <div className="text-gray-500 text-xs tracking-wider uppercase">Dedication</div>
              </div>
            </div>

            {/* Social Icons */}
            <div className={`flex items-center space-x-5 ${isLoaded ? 'animate-slide-in-left animation-delay-800' : 'opacity-0'}`}>
              <span className="text-gray-600 text-xs tracking-widest">CONNECT</span>
              <div className="w-8 h-px bg-gray-700"></div>
              {/* GitHub */}
              <a href={profile?.github_url || "https://github.com"} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href={profile?.linkedin_url || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Email */}
              <a href={`mailto:${profile?.email || "hello@example.com"}`} className="text-gray-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Geometric decoration */}
          <div className="absolute bottom-8 left-8 hidden lg:block opacity-20">
            <div className="w-20 h-20 border border-gray-600 rotate-45"></div>
            <div className="w-10 h-10 border border-gray-500 absolute top-5 left-5 rotate-45"></div>
          </div>
        </div>

        {/* Right Side - Black */}
        <div className="w-full md:w-1/2 bg-black relative flex flex-col min-h-[40vh] md:min-h-screen">
          {/* Navigation - Desktop */}
          <nav className={`hidden md:flex absolute top-8 right-8 lg:right-12 items-center space-x-8 z-10 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-400 text-sm font-medium tracking-wider hover:text-white transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <a
              href="#contact"
              className="px-7 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            >
              CONTACT ME
            </a>
          </nav>

          {/* Portrait Image Area */}
          <div className={`flex-grow flex items-center justify-center p-8 ${isLoaded ? 'animate-slide-in-right animation-delay-400' : 'opacity-0'}`}>
            <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 animate-float">
              {/* Glow effect behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl"></div>
              
              {/* Main container */}
              <div className="absolute inset-0 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-2 border border-gray-700/50 rounded-xl"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                  {/* Profile content */}
                  <div className="text-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 flex items-center justify-center border border-gray-600/50 glow-accent overflow-hidden">
                      {profile?.profile_image ? (
                        <img 
                          src={profile.profile_image} 
                          alt={profile.name || 'Profile'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-accent">
                          {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'MA'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-6 tracking-[0.2em] uppercase">
                      {profile?.available_for_hire ? 'Available for hire' : 'Currently unavailable'}
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${profile?.available_for_hire ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={`text-xs ml-2 ${profile?.available_for_hire ? 'text-green-400' : 'text-gray-400'}`}>
                        {profile?.available_for_hire ? 'Open to opportunities' : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Corner accents */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-sm"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-sm"></div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 right-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse animation-delay-200"></div>
            </div>
          </div>

          {/* Vertical text decoration */}
          <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2">
            <p className="text-gray-800 text-xs tracking-[0.3em] transform -rotate-90 whitespace-nowrap">
              PORTFOLIO — 2026
            </p>
          </div>

          {/* Scroll indicator */}
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center ${isLoaded ? 'animate-fade-in animation-delay-800' : 'opacity-0'}`}>
            <span className="text-gray-600 text-xs tracking-widest mb-3">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent relative overflow-hidden">
              <div className="w-full h-4 bg-white absolute animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

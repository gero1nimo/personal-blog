import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About me' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/blog', label: 'Blog' },
  ];
  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 border border-white flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wider transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="/#contact"
              className="px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              CONTACT ME
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 text-base font-medium tracking-wider ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="mx-3 bg-white text-black px-4 py-2 rounded-full text-base font-medium text-center hover:bg-gray-200 transition-colors"
              >
                CONTACT ME
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

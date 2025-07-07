
import React, { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">
              Price<span className="text-accent">Radar</span>
            </h1>
          </div>

          {/* Navigation Links & Buy Me a Coffee Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label="About PriceRadar"
              >
                About
              </a>
              <a
                href="#github"
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label="View source code on GitHub"
              >
                GitHub
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label="Contact us"
              >
                Contact
              </a>
            </div>
            
            {/* Buy Me a Coffee Button */}
            <a
              href="#coffee"
              className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 
                       rounded-xl font-semibold hover:bg-yellow-400 transition-all duration-200 
                       transform hover:scale-105"
              aria-label="Support us - Buy me a coffee"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Buy Me a Coffee
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-600 hover:text-primary p-2"
              aria-label="Open mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

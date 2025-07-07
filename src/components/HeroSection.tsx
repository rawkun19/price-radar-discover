
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find the Best Price —{' '}
            <span className="text-primary">Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Search across top platforms in real time and never overpay again.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className={`relative max-w-2xl mx-auto transition-all duration-300 ${
            isFocused ? 'transform scale-105' : ''
          }`}>
            <div className={`relative rounded-2xl shadow-xl bg-white transition-all duration-300 ${
              isFocused ? 'ring-4 ring-primary/20 shadow-2xl' : 'shadow-lg'
            }`}>
              <div className="flex items-center p-2">
                <div className="flex-shrink-0 pl-4">
                  <Search className={`h-6 w-6 transition-colors duration-200 ${
                    isFocused ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter product name (e.g., Redmi Note 13 Pro)"
                  className="flex-1 px-6 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold 
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 transform hover:scale-105
                           focus:outline-none focus:ring-4 focus:ring-primary/20"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    'Compare Now'
                  )}
                </button>
              </div>
            </div>
            
            {/* Pulse ring animation when focused */}
            {isFocused && (
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-pulse-ring pointer-events-none"></div>
            )}
          </div>
        </form>

        {/* Popular searches */}
        <div className="mt-8 animate-fade-in">
          <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['iPhone 15', 'Samsung Galaxy S24', 'MacBook Air M3', 'Sony WH-1000XM5'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  onSearch(term);
                }}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 
                         hover:text-primary hover:bg-blue-50 transition-all duration-200
                         border border-gray-200 hover:border-primary/20"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

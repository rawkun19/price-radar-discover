
import React, { useState } from 'react';
import { Search, TrendingUp, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Compare and Find the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Cheapest Products
            </span>{' '}
            Online in Seconds
          </h1>

          {/* Subheading */}
          <h2 className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            Real-Time Price Comparison Tool for Amazon, Flipkart, and More
          </h2>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Save money and time with our intelligent price comparison engine. 
            Search once, compare everywhere, buy smarter.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products... (e.g., iPhone 15, MacBook Pro, Samsung TV)"
                className="flex-1 px-6 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-0 placeholder-gray-400"
                disabled={isLoading}
                aria-label="Product search input"
              />
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 
                         rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 
                         transition-all duration-200 transform hover:scale-105 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                         flex items-center justify-center min-w-[120px]"
                aria-label="Search for products"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" 
                         aria-hidden="true"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Search suggestions */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['iPhone 15', 'MacBook Air', 'Samsung Galaxy', 'AirPods Pro', 'iPad'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm 
                           hover:bg-gray-200 transition-colors duration-200"
                  aria-label={`Search for ${suggestion}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 
                           group-hover:bg-blue-200 transition-colors duration-200">
              <Zap className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get instant price comparisons across multiple platforms in seconds</p>
          </div>

          <div className="text-center group">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 
                           group-hover:bg-green-200 transition-colors duration-200">
              <TrendingUp className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Updated</h3>
            <p className="text-gray-600">Real-time pricing data ensures you never miss a deal</p>
          </div>

          <div className="text-center group">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 
                           group-hover:bg-purple-200 transition-colors duration-200">
              <Shield className="w-8 h-8 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600">No hidden fees, no registration required. Just pure savings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

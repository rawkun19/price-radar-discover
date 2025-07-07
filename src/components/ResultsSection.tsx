
import React from 'react';
import { PriceResult } from '../pages/Index';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';

interface ResultsSectionProps {
  results: PriceResult[];
  isLoading: boolean;
  searchQuery: string;
  error: string | null;
  onRetry: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  isLoading,
  searchQuery,
  error,
  onRetry
}) => {
  if (isLoading) {
    return (
      <section className="py-16 bg-white" aria-live="polite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Searching for "{searchQuery}"...
            </h2>
            <p className="text-gray-600">Comparing prices across platforms</p>
          </div>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white" role="alert">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 rounded-2xl p-8">
            <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold 
                       hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              aria-label="Retry search for products"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white" aria-live="polite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Price Comparison Results for "{searchQuery}"
          </h2>
          <p className="text-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''} across platforms
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
          {results.map((result, index) => (
            <div
              key={result.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              role="listitem"
            >
              <ResultCard result={result} />
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-gray-500 text-sm">
            Prices are updated in real-time. Last updated just now.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;

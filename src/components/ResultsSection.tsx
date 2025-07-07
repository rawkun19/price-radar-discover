
import React, { useState } from 'react';
import { PriceResult } from '../pages/Index';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface ResultsSectionProps {
  results: PriceResult[];
  isLoading: boolean;
  searchQuery: string;
  error: string | null;
  onRetry: () => void;
}

const RESULTS_PER_PAGE = 9; // 3x3 grid for desktop

const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  isLoading,
  searchQuery,
  error,
  onRetry
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const currentResults = results.slice(startIndex, endIndex);

  // Reset page when results change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [results]);

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
            {totalPages > 1 && (
              <span className="block mt-1 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, results.length)} of {results.length}
              </span>
            )}
          </p>
        </div>

        {/* Results Grid - Fixed height container to prevent layout jumping */}
        <div className="min-h-[600px] mb-8">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr" role="list">
            {currentResults.map((result, index) => (
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, filteredPages) => (
                    <React.Fragment key={page}>
                      {/* Add ellipsis if there's a gap */}
                      {index > 0 && filteredPages[index - 1] < page - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}

                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Bottom message */}
        <div className="text-center animate-fade-in">
          <p className="text-gray-500 text-sm">
            Prices are updated in real-time. Last updated just now.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;

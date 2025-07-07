
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ResultsSection from '../components/ResultsSection';
import FeedbackSection from '../components/FeedbackSection';
import Footer from '../components/Footer';

export interface PriceResult {
  id: string;
  platform: string;
  platformLogo: string;
  title: string;
  price: number;
  deliveryTime: string;
  url: string;
  image: string;
  isLowestPrice?: boolean;
}

const Index = () => {
  const [results, setResults] = useState<PriceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Real API call to our scraper backend
      console.log(`Searching for: ${query}`);
      
      const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const apiResults = await response.json();
      
      // The API now returns data in the correct format
      const mockResults: PriceResult[] = apiResults;

      setResults(mockResults);
    } catch (err) {
      console.error('Search error:', err);
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Search timed out. Please try again with a shorter query.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to search service. Please check if the backend is running.');
        } else {
          setError(`Search failed: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection onSearch={handleSearch} isLoading={isLoading} />
      {hasSearched && (
        <ResultsSection 
          results={results} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          error={error}
          onRetry={() => handleSearch(searchQuery)}
        />
      )}
      <FeedbackSection />
      <Footer />
    </div>
  );
};

export default Index;

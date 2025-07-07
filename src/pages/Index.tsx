
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ResultsSection from '../components/ResultsSection';
import Footer from '../components/Footer';

export interface PriceResult {
  id: string;
  platform: string;
  platformLogo: string;
  title: string;
  price: number;
  deliveryTime: string;
  url: string;
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
      // Simulate API call - replace with actual API endpoint
      console.log(`Searching for: ${query}`);
      
      // Mock API response with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults: PriceResult[] = [
        {
          id: '1',
          platform: 'Amazon',
          platformLogo: '🛒',
          title: `${query} - 128GB, Midnight Black`,
          price: 18999,
          deliveryTime: 'Free delivery by tomorrow',
          url: '#',
          isLowestPrice: true
        },
        {
          id: '2',
          platform: 'Flipkart',
          platformLogo: '🛍️',
          title: `${query} - 128GB Storage`,
          price: 19499,
          deliveryTime: 'Delivery in 2-3 days',
          url: '#'
        },
        {
          id: '3',
          platform: 'Myntra',
          platformLogo: '👕',
          title: `${query} - Official Store`,
          price: 19999,
          deliveryTime: 'Express delivery available',
          url: '#'
        }
      ];

      setResults(mockResults);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
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
      <Footer />
    </div>
  );
};

export default Index;


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
      // Simulate API call - replace with actual API endpoint
      console.log(`Searching for: ${query}`);
      
      // Mock API response with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results - expanded to test pagination
      const mockResults: PriceResult[] = [
        {
          id: '1',
          platform: 'Amazon',
          platformLogo: '🛒',
          title: `${query} - 128GB, Midnight Black`,
          price: 18999,
          deliveryTime: 'Free delivery by tomorrow',
          url: '#',
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
          isLowestPrice: true
        },
        {
          id: '2',
          platform: 'Flipkart',
          platformLogo: '🛍️',
          title: `${query} - 128GB Storage`,
          price: 19499,
          deliveryTime: 'Delivery in 2-3 days',
          url: '#',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
        },
        {
          id: '3',
          platform: 'Myntra',
          platformLogo: '👕',
          title: `${query} - Official Store`,
          price: 19999,
          deliveryTime: 'Express delivery available',
          url: '#',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'
        },
        {
          id: '4',
          platform: 'Amazon',
          platformLogo: '🛒',
          title: `${query} - 256GB, Blue`,
          price: 22999,
          deliveryTime: 'Free delivery by tomorrow',
          url: '#',
          image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
        },
        {
          id: '5',
          platform: 'Flipkart',
          platformLogo: '🛍️',
          title: `${query} - 256GB Storage`,
          price: 23499,
          deliveryTime: 'Delivery in 2-3 days',
          url: '#',
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop'
        },
        {
          id: '6',
          platform: 'Myntra',
          platformLogo: '👕',
          title: `${query} - Premium Edition`,
          price: 24999,
          deliveryTime: 'Express delivery available',
          url: '#',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
        },
        {
          id: '7',
          platform: 'Amazon',
          platformLogo: '🛒',
          title: `${query} - 512GB, Gold`,
          price: 28999,
          deliveryTime: 'Free delivery by tomorrow',
          url: '#',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'
        },
        {
          id: '8',
          platform: 'Flipkart',
          platformLogo: '🛍️',
          title: `${query} - 512GB Storage`,
          price: 29499,
          deliveryTime: 'Delivery in 2-3 days',
          url: '#',
          image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
        },
        {
          id: '9',
          platform: 'Myntra',
          platformLogo: '👕',
          title: `${query} - Limited Edition`,
          price: 31999,
          deliveryTime: 'Express delivery available',
          url: '#',
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop'
        },
        {
          id: '10',
          platform: 'Amazon',
          platformLogo: '🛒',
          title: `${query} - 1TB, Silver`,
          price: 35999,
          deliveryTime: 'Free delivery by tomorrow',
          url: '#',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
        },
        {
          id: '11',
          platform: 'Flipkart',
          platformLogo: '🛍️',
          title: `${query} - 1TB Storage`,
          price: 36499,
          deliveryTime: 'Delivery in 2-3 days',
          url: '#',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'
        },
        {
          id: '12',
          platform: 'Myntra',
          platformLogo: '👕',
          title: `${query} - Pro Max Edition`,
          price: 39999,
          deliveryTime: 'Express delivery available',
          url: '#',
          image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
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
      <FeedbackSection />
      <Footer />
    </div>
  );
};

export default Index;

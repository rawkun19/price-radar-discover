
import React from 'react';
import { PriceResult } from '../pages/Index';
import { AspectRatio } from './ui/aspect-ratio';

interface ResultCardProps {
  result: PriceResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                    transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Lowest Price Badge */}
      {result.isLowestPrice && (
        <div className="bg-accent text-white px-4 py-2 text-sm font-semibold flex items-center" role="banner">
          <span className="mr-2" aria-hidden="true">🏷️</span>
          <span>Lowest Price</span>
        </div>
      )}

      <div className="p-6">
        {/* Product Image */}
        <div className="mb-4">
          <AspectRatio ratio={1} className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={result.image}
              alt={result.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </AspectRatio>
        </div>

        {/* Platform Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3" aria-hidden="true">{result.platformLogo}</span>
            <span className="font-semibold text-gray-900">{result.platform}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary" aria-label={`Price: ${formatPrice(result.price)}`}>
              {formatPrice(result.price)}
            </div>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-gray-800 font-medium mb-3 line-clamp-2 leading-snug">
          {result.title}
        </h3>

        {/* Delivery Info */}
        <p className="text-sm text-gray-600 mb-4 flex items-center">
          <span className="mr-2" aria-hidden="true">🚚</span>
          <span>{result.deliveryTime}</span>
        </p>

        {/* Buy Now Button */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary text-white text-center py-3 px-4 rounded-xl 
                   font-semibold hover:bg-blue-700 transition-all duration-200 
                   transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/20"
          aria-label={`Buy ${result.title} from ${result.platform} for ${formatPrice(result.price)}`}
        >
          Buy Now on {result.platform}
        </a>
      </div>
    </article>
  );
};

export default ResultCard;


import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Main spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-accent rounded-full animate-spin" 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Loading cards skeleton */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-2/3 h-3 bg-gray-200 rounded mb-4"></div>
              <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;

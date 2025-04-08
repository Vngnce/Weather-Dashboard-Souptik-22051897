import React from 'react';

function LoadingSpinner({ isDarkMode }) {
  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 text-center animate-fadeIn" aria-label="Loading weather data">
      {/* Improved accessible spinner */}
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 animate-pulse" role="status">
         <div className={`absolute inset-0 border-4 rounded-full ${
           isDarkMode ? 'border-gray-700' : 'border-blue-200'
         }`}></div>
         <div className={`absolute inset-0 border-t-4 rounded-full animate-spin ${
           isDarkMode ? 'border-purple-500' : 'border-blue-600'
         }`}></div>
         <span className="sr-only">Loading...</span> {/* Hidden text for screen readers */}
      </div>
       {/* Optional visible text */}
       <p className={`text-base sm:text-lg mt-3 sm:mt-4 font-medium animate-pulse ${
         isDarkMode ? 'text-gray-300' : 'text-gray-700'
       }`}>Fetching Weather...</p>
    </div>
  );
}

export default LoadingSpinner;
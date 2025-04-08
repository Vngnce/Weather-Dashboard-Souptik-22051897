import React from 'react';

function ErrorMessage({ message, isDarkMode }) {
  // Provide a default message if none is passed
  const displayMessage = message || 'An unexpected error occurred. Please try again.';

  return (
    <div
      className={`${
        isDarkMode 
          ? 'bg-red-900 bg-opacity-80 border-red-600 text-red-100' 
          : 'bg-red-100 border-red-500 text-red-800'
      } border-l-4 p-3 sm:p-4 rounded-md shadow-md w-full animate-fadeIn animate-shake`}
      role="alert" // Important for accessibility, indicates an error message
    >
      <p className={`font-bold text-sm sm:text-base mb-1 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
        Error
      </p>
      <p className="text-sm sm:text-base">{displayMessage}</p>
    </div>
  );
}

export default ErrorMessage;
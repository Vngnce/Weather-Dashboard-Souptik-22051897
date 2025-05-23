import React from 'react';

function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-20 p-2 rounded-full shadow-lg transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 animate-fadeIn ${
        isDarkMode 
          ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm hover:bg-opacity-90' 
          : 'bg-white bg-opacity-80 backdrop-blur-sm hover:bg-opacity-90'
      }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        // Sun icon for dark mode (clicking will switch to light mode)
        <svg 
          className="w-6 h-6 text-yellow-300 animate-spin-slow" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon for light mode (clicking will switch to dark mode)
        <svg 
          className="w-6 h-6 text-blue-900 animate-bounce-subtle" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle; 
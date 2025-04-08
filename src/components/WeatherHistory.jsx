import React from 'react';

function WeatherHistory({ history, onSelectCity, isDarkMode }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-4xl mt-6 sm:mt-8 animate-fadeIn`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Recent Searches
      </h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {history.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onSelectCity(item.name)}
            className={`${
              isDarkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-75'
            } backdrop-blur-sm rounded-lg p-2 sm:p-3 text-left hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 animate-fadeInUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {item.name}{item.sys?.country ? `, ${item.sys.country}` : ''}
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                  {Math.round(item.main.temp)}°C - {item.weather[0]?.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default WeatherHistory; 
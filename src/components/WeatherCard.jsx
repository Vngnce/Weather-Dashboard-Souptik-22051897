import React, { useState } from 'react';

function WeatherCard({ data, isDarkMode, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Perform robust check for necessary data points
  if (!data || !data.main || !data.weather || !data.weather[0] || !data.wind || !data.sys) {
     console.error("WeatherCard received invalid or incomplete data:", data);
     // Return null or a minimal error message instead of crashing
     return <div className="text-center text-red-600 p-4 animate-fadeIn">Weather data unavailable.</div>;
   }

  // Destructure with defaults for robustness, although checks above should prevent issues
  const { name = 'Unknown Location', main = {}, weather = [{}], wind = {}, sys = {} } = data;

  // Extract and format data points, providing fallbacks
  const temp = Math.round(main.temp ?? 'N/A'); // Using nullish coalescing
  const feelsLike = Math.round(main.feels_like ?? 'N/A');
  const humidity = main.humidity ?? 'N/A';
  const windSpeed = wind.speed !== undefined ? wind.speed.toFixed(1) : 'N/A'; // Check for undefined explicitly
  const description = weather[0]?.description || 'No description';
  const mainWeather = weather[0]?.main || '';
  const iconCode = weather[0]?.icon;
  const country = sys.country || ''; // Country code might be optional

  // Construct icon URL using HTTPS and larger icon size
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@4x.png` : ''; // Use @4x for higher resolution

  // Capitalize the first letter of each word in the description
  const capitalizedDescription = description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000); // Minimum animation time
  };

  return (
    // Added animation classes for a more dynamic appearance
    <div className={`bg-white bg-opacity-75 backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md animate-fadeIn transition-all duration-500 transform hover:shadow-3xl hover:scale-[1.02] ${isDarkMode ? 'bg-gray-800 bg-opacity-80 text-gray-100' : 'text-gray-900'}`}>
      {/* Location with Refresh Button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-center flex-grow animate-fadeInDown transition-transform duration-300 hover:scale-[1.03] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {name}{country ? `, ${country}` : ''}
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`ml-2 p-2 rounded-full transition-all duration-300 transform
            ${isDarkMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }
            ${isRefreshing ? 'animate-spin' : 'hover:scale-110'}
          `}
          aria-label="Refresh weather data"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>

      {/* Main Weather Info: Icon, Temp, Description */}
      <div className="flex flex-col items-center text-center my-3 sm:my-4">
         {iconUrl && (
           <img
             src={iconUrl}
             alt={mainWeather}
             // Larger icon size
             className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 -mt-1 -mb-1 sm:-mt-2 sm:-mb-2 animate-bounce-subtle transition-transform duration-300 hover:scale-110"
             width="96" // Match dimensions for layout stability
             height="96"
             loading="lazy" // Lazy load image
           />
         )}
         <p className={`text-3xl sm:text-4xl md:text-5xl font-bold mt-1 sm:mt-2 animate-fadeInUp transition-transform duration-300 hover:scale-[1.03] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{temp}°C</p>
         <p className={`text-base sm:text-lg capitalize mt-1 animate-fadeInUp transition-transform duration-300 hover:scale-[1.03] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{capitalizedDescription}</p>
         <p className={`text-xs sm:text-sm mt-1 animate-fadeInUp transition-transform duration-300 hover:scale-[1.03] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Feels like {feelsLike}°C</p>
      </div>

      {/* Detailed Info Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center text-xs sm:text-sm md:text-base mt-3 sm:mt-4">
        <div className={`p-2 sm:p-3 rounded-lg animate-fadeInLeft transition-all duration-300 hover:scale-[1.05] ${isDarkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-400 bg-opacity-20'}`}>
          <p className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Humidity</p>
          <p className={`text-base sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{humidity}%</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg animate-fadeInRight transition-all duration-300 hover:scale-[1.05] ${isDarkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-400 bg-opacity-20'}`}>
          <p className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Wind Speed</p>
          <p className={`text-base sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
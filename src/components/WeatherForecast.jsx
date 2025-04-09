import React from 'react';

function WeatherForecast({ forecastData, isDarkMode }) {
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    return null;
  }

  // Group forecast data by day
  const groupedForecast = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    
    acc[dayKey].push(item);
    return acc;
  }, {});

  // Sort and limit to 5 days
  const forecastDays = Object.entries(groupedForecast)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .slice(0, 5);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayName, dayDate };
  };

  return (
    <div className={`w-full max-w-4xl mt-6 sm:mt-8 animate-fadeIn ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center animate-fadeInDown transition-transform duration-300 hover:scale-[1.03] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {forecastDays.map(([dayKey, forecasts], index) => {
          const { dayName, dayDate } = formatDate(dayKey);
          
          // Calculate average temperature
          const avgTemp = forecasts.reduce((sum, item) => sum + item.main.temp, 0) / forecasts.length;
          
          // Get most common weather condition
          const weatherCounts = forecasts.reduce((acc, item) => {
            const condition = item.weather[0].main;
            acc[condition] = (acc[condition] || 0) + 1;
            return acc;
          }, {});
          
          const mostCommonWeather = Object.entries(weatherCounts)
            .sort(([, a], [, b]) => b - a)[0][0];
          
          const weatherIcon = forecasts.find(item => 
            item.weather[0].main === mostCommonWeather
          )?.weather[0].icon;

          return (
            <div 
              key={dayKey}
              className={`${isDarkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-75'} backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 text-center shadow-lg animate-fadeInUp transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:z-10`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm sm:text-base font-medium animate-fadeInDown transition-transform duration-300 hover:scale-[1.03]`}>
                {dayName}
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm animate-fadeInDown transition-transform duration-300 hover:scale-[1.03]`}>
                {dayDate}
              </div>
              
              {weatherIcon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                  alt={mostCommonWeather}
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 animate-bounce-subtle transition-transform duration-300 hover:scale-110"
                  width="64"
                  height="64"
                  loading="lazy"
                />
              )}
              
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg sm:text-xl font-semibold mt-1 sm:mt-2 animate-fadeInUp transition-transform duration-300 hover:scale-[1.03]`}>
                {Math.round(avgTemp)}°C
              </div>
              
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm capitalize mt-1 animate-fadeInUp transition-transform duration-300 hover:scale-[1.03]`}>
                {mostCommonWeather.toLowerCase()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherForecast; 
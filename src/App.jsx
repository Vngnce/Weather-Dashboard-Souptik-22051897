import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WeatherHistory from './components/WeatherHistory';
import WeatherForecast from './components/WeatherForecast';
import ThemeToggle from './components/ThemeToggle';
import { getWeatherHistory, addWeatherToHistory } from './utils/weatherStorage';

function App() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // API configuration
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  // Initialize app with saved preferences
  useEffect(() => {
    try {
      setWeatherHistory(getWeatherHistory());
      
      // Load saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      setError('Failed to initialize application. Please refresh the page.');
    }
  }, []);

  // Fetch weather data when search query changes
  useEffect(() => {
    if (!searchQuery) return;

    if (!apiKey) {
      setError("Weather service is not configured. Missing API Key.");
      setLoading(false);
      setWeatherData(null);
      setForecastData(null);
      return;
    }

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setWeatherData(null);
      setForecastData(null);

      try {
        // Fetch current weather
        const weatherResponse = await axios.get(weatherApiUrl, {
          params: {
            q: searchQuery,
            appid: apiKey,
            units: 'metric',
          },
          timeout: 10000
        });
        setWeatherData(weatherResponse.data);
        
        // Update history
        const updatedHistory = addWeatherToHistory(weatherResponse.data);
        setWeatherHistory(updatedHistory);

        // Fetch forecast
        const forecastResponse = await axios.get(forecastApiUrl, {
          params: {
            q: searchQuery,
            appid: apiKey,
            units: 'metric',
          },
          timeout: 10000
        });
        setForecastData(forecastResponse.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          setError("Request timed out.");
        } else if (err.response) {
          if (err.response.status === 401) {
            setError(`Authentication failed. Check your API key.`);
          } else if (err.response.status === 404) {
            setError(`City not found: "${searchQuery}". Please check spelling.`);
          } else if (err.response.status >= 500) {
            setError(`Server error (${err.response.status}). Please try again later.`);
          } else {
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to fetch weather.'}`);
          }
        } else if (err.request) {
          setError('Network error. Could not reach weather service. Check connection.');
        } else {
          setError('An unexpected error occurred.');
        }
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [searchQuery, apiKey]);

  // Event handlers
  const handleSearch = (city) => {
    if (city.trim().toLowerCase() !== searchQuery.toLowerCase()) {
      setSearchQuery(city.trim());
    }
  };

  const handleHistorySelect = (cityName) => {
    setSearchQuery(cityName);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Refresh current weather data
  const handleRefresh = async () => {
    if (!weatherData?.name) return;
    
    setError(null);
    
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(weatherApiUrl, {
        params: {
          q: weatherData.name,
          appid: apiKey,
          units: 'metric',
        },
        timeout: 10000
      });
      setWeatherData(weatherResponse.data);
      
      // Fetch updated forecast
      const forecastResponse = await axios.get(forecastApiUrl, {
        params: {
          q: weatherData.name,
          appid: apiKey,
          units: 'metric',
        },
        timeout: 10000
      });
      setForecastData(forecastResponse.data);
      
    } catch (err) {
      setError("Failed to refresh weather data. Please try again.");
    }
  };

  // Initial message based on API key presence
  const initialMessage = !apiKey
    ? "API Key not configured. Please set VITE_OPENWEATHERMAP_API_KEY in your .env file."
    : "Enter a city name to get the current weather!";

  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 pt-6 sm:pt-10 md:pt-16 transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white'}`}>
      {error && (
        <div className="w-full max-w-md mx-auto p-4 bg-red-500 text-white rounded-lg shadow-lg mt-4">
          <p className="text-center">{error}</p>
        </div>
      )}
      
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center drop-shadow-lg animate-fade-in">
        Weather Dashboard
      </h1>

      <div className="w-full max-w-md px-2 sm:px-4 z-10">
         <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-4xl px-2 sm:px-4 flex-grow flex flex-col items-center">
        {loading && <LoadingSpinner />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && weatherData && (
          <WeatherCard 
            data={weatherData} 
            isDarkMode={isDarkMode} 
            onRefresh={handleRefresh}
          />
        )}

        {!loading && !error && !weatherData && (
          <p className={`text-center text-base sm:text-lg mt-6 sm:mt-10 p-3 rounded shadow animate-fade-in ${!apiKey ? 'bg-red-500 bg-opacity-80' : isDarkMode ? 'bg-black bg-opacity-40' : 'bg-black bg-opacity-20'}`}>
            {initialMessage}
          </p>
        )}

        {!loading && !error && forecastData && (
          <WeatherForecast forecastData={forecastData} isDarkMode={isDarkMode} />
        )}

        <WeatherHistory 
          history={weatherHistory} 
          onSelectCity={handleHistorySelect}
          isDarkMode={isDarkMode}
        />
      </div>

      <footer className="text-center py-3 sm:py-4 mt-auto text-xs sm:text-sm text-white text-opacity-70">
        Weather data provided by OpenWeatherMap
      </footer>
    </div>
  );
}

export default App;
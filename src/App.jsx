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
  console.log('App component initializing...'); // Debug log

  // State for the controlled input in SearchBar (optional to keep here, SearchBar manages its own)
  // const [cityInput, setCityInput] = useState('');
  // State that triggers the API call when it changes
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get API Key from environment variables (ensure Vite prefix VITE_ is used)
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  console.log('Environment check:', {
    apiKeyExists: !!apiKey,
    nodeEnv: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL
  });
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  // Load weather history and theme preference on component mount
  useEffect(() => {
    try {
      console.log('Loading initial data...'); // Debug log
      setWeatherHistory(getWeatherHistory());
      
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
      console.log('Initial data loaded successfully'); // Debug log
    } catch (err) {
      console.error('Error during initialization:', err);
      setError('Failed to initialize application. Please refresh the page.');
    }
  }, []);

  // Effect to fetch data when searchQuery changes
  useEffect(() => {
    // Do nothing if searchQuery is empty
    if (!searchQuery) return;

    // Check for API Key presence *before* fetching
    if (!apiKey) {
      console.error("API Key is missing. Set VITE_OPENWEATHERMAP_API_KEY in .env file.");
      setError("Weather service is not configured. Missing API Key.");
      setLoading(false); // Ensure loading stops
      setWeatherData(null); // Clear any stale data
      setForecastData(null);
      return; // Stop the effect execution
    }

    const fetchWeatherData = async () => {
      console.log(`Fetching weather for: ${searchQuery}`); // Log search attempt
      setLoading(true);
      setError(null); // Clear previous errors
      setWeatherData(null); // Clear previous data
      setForecastData(null);

      try {
        // Fetch current weather
        const weatherResponse = await axios.get(weatherApiUrl, {
          params: {
            q: searchQuery,
            appid: apiKey,
            units: 'metric', // Get temp in Celsius
          },
          timeout: 10000 // Add a timeout (10 seconds)
        });
        console.log('Weather API Response:', weatherResponse.data); // Log successful API response
        setWeatherData(weatherResponse.data);
        
        // Add to history and update state
        const updatedHistory = addWeatherToHistory(weatherResponse.data);
        setWeatherHistory(updatedHistory);

        // Fetch 5-day forecast
        const forecastResponse = await axios.get(forecastApiUrl, {
          params: {
            q: searchQuery,
            appid: apiKey,
            units: 'metric',
          },
          timeout: 10000
        });
        console.log('Forecast API Response:', forecastResponse.data);
        setForecastData(forecastResponse.data);
      } catch (err) {
        console.error("API Error:", err); // Log the full error object

        if (axios.isCancel(err)) {
            console.log('Request canceled:', err.message);
            setError("Request timed out.");
        } else if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error Response Data:", err.response.data);
          console.error("Error Response Status:", err.response.status);
          if (err.response.status === 401) {
            setError(`Authentication failed. Check your API key.`);
          } else if (err.response.status === 404) {
            setError(`City not found: "${searchQuery}". Please check spelling.`);
          } else if (err.response.status >= 500) {
             setError(`Server error (${err.response.status}). Please try again later.`);
          }
           else {
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to fetch weather.'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error("Error Request:", err.request);
          setError('Network error. Could not reach weather service. Check connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error Message:', err.message);
          setError('An unexpected error occurred.');
        }
        setWeatherData(null); // Ensure no stale data is shown on error
        setForecastData(null);
      } finally {
        setLoading(false); // Stop loading indicator regardless of outcome
      }
    };

    fetchWeatherData();

    // Cleanup function (optional, can be useful for canceling requests)
    // return () => {
    //   // Cleanup logic if needed, e.g., cancel Axios request
    // };

  }, [searchQuery, apiKey]); // Dependency array: rerun effect if query or key changes

  // Handler passed to SearchBar to update the search query
  const handleSearch = (city) => {
     // Only update if the city is new to prevent redundant API calls
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
    
    // Save theme preference
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Toggle dark class on html element
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Function to refresh current weather data
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
      console.error("Refresh Error:", err);
      setError("Failed to refresh weather data. Please try again.");
    }
  };

  // Determine initial message based on API key presence
  const initialMessage = !apiKey
    ? "API Key not configured. Please set VITE_OPENWEATHERMAP_API_KEY in your .env file."
    : "Enter a city name to get the current weather!";

  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 pt-6 sm:pt-10 md:pt-16 transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white'}`}>
      {/* Add a fallback error message at the top level */}
      {error && (
        <div className="w-full max-w-md mx-auto p-4 bg-red-500 text-white rounded-lg shadow-lg mt-4">
          <p className="text-center">{error}</p>
        </div>
      )}
      
      {/* Theme Toggle Button */}
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center drop-shadow-lg animate-fade-in">
        Weather Dashboard
      </h1>

      {/* Search Bar Component */}
      <div className="w-full max-w-md px-2 sm:px-4 z-10">
         <SearchBar onSearch={handleSearch} />
      </div>


      {/* Results Area */}
      <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-4xl px-2 sm:px-4 flex-grow flex flex-col items-center">
        {/* --- Conditional Rendering Logic --- */}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State (only show if not loading) */}
        {!loading && error && <ErrorMessage message={error} />}

        {/* Success State (only show if not loading and no error) */}
        {!loading && !error && weatherData && (
          <WeatherCard 
            data={weatherData} 
            isDarkMode={isDarkMode} 
            onRefresh={handleRefresh}
          />
        )}

        {/* Initial/Idle State (only show if not loading, no error, and no data) */}
        {!loading && !error && !weatherData && (
             <p className={`text-center text-base sm:text-lg mt-6 sm:mt-10 p-3 rounded shadow animate-fade-in ${!apiKey ? 'bg-red-500 bg-opacity-80' : isDarkMode ? 'bg-black bg-opacity-40' : 'bg-black bg-opacity-20'}`}>
                 {initialMessage}
             </p>
         )}

        {/* 5-Day Forecast Component */}
        {!loading && !error && forecastData && (
          <WeatherForecast forecastData={forecastData} isDarkMode={isDarkMode} />
        )}

        {/* Weather History Component */}
        <WeatherHistory 
          history={weatherHistory} 
          onSelectCity={handleHistorySelect}
          isDarkMode={isDarkMode}
        />
      </div>

        {/* Optional Footer */}
        <footer className="text-center py-3 sm:py-4 mt-auto text-xs sm:text-sm text-white text-opacity-70">
            Weather data provided by OpenWeatherMap
        </footer>
    </div>
  );
}

export default App;
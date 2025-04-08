// Utility functions for managing weather history in localStorage

const STORAGE_KEY = 'weather_history';
const MAX_HISTORY_ITEMS = 5;

// Get all stored weather history
export const getWeatherHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading weather history:', error);
    return [];
  }
};

// Add new weather data to history
export const addWeatherToHistory = (weatherData) => {
  try {
    const history = getWeatherHistory();
    
    // Remove existing entry for the same city if it exists
    const filteredHistory = history.filter(
      item => item.name.toLowerCase() !== weatherData.name.toLowerCase()
    );
    
    // Add new data at the beginning
    const newHistory = [weatherData, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    // Store updated history
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    
    return newHistory;
  } catch (error) {
    console.error('Error saving weather history:', error);
    return getWeatherHistory();
  }
};

// Clear all weather history
export const clearWeatherHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing weather history:', error);
    return getWeatherHistory();
  }
}; 
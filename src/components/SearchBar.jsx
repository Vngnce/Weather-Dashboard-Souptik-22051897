import React, { useState, useEffect, useRef } from 'react';

function SearchBar({ onSearch, isDarkMode }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const dropdownRef = useRef(null);

  // List of popular cities including Indian cities
  const popularCities = [
    // International cities
    'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam',
    'Vienna', 'Prague', 'Budapest', 'Barcelona', 'Lisbon', 'Athens', 'Stockholm',
    'Copenhagen', 'Helsinki', 'Oslo', 'Dublin', 'Brussels', 'Zurich', 'Munich',
    'Milan', 'Venice', 'Florence', 'Seville', 'Porto',
    
    // Indian cities
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Aurangabad', 'Rajkot', 'Meerut', 'Jabalpur', 'Jamshedpur', 'Allahabad',
    'Varanasi', 'Kochi', 'Amritsar', 'Vijayawada', 'Gwalior', 'Bhubaneswar', 'Dehradun',
    'Mangalore', 'Raipur', 'Kozhikode', 'Thiruvananthapuram', 'Tiruchirappalli', 'Kota',
    'Guwahati', 'Chandigarh', 'Thrissur', 'Tirunelveli', 'Kollam', 'Aligarh', 'Bareilly',
    'Moradabad', 'Solapur', 'Jhansi', 'Gorakhpur', 'Warangal', 'Salem', 'Mysore',
    'Guntur', 'Bhubaneshwar', 'Amravati', 'Jodhpur', 'Madurai', 'Ranchi', 'Gorakhpur',
    'Jammu', 'Srinagar', 'Shimla', 'Manali', 'Ooty', 'Darjeeling', 'Shillong', 'Gangtok',
    'Port Blair', 'Kochi', 'Goa', 'Pondicherry', 'Daman', 'Diu', 'Silvassa'
  ];

  // Filter cities based on input
  useEffect(() => {
    const searchTerm = inputValue.trim().toLowerCase();
    if (searchTerm.length > 0) {
      const filtered = popularCities.filter(city => {
        // Check if the city name starts with the search term
        const startsWith = city.toLowerCase().startsWith(searchTerm);
        // Check if the city name contains the search term
        const contains = city.toLowerCase().includes(searchTerm);
        // Prioritize cities that start with the search term
        return startsWith || contains;
      });

      // Sort results to prioritize exact matches and matches at the start of words
      const sortedResults = filtered.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        // Prioritize exact matches
        if (aLower === searchTerm) return -1;
        if (bLower === searchTerm) return 1;
        
        // Then prioritize matches at the start of words
        const aStartsWith = aLower.startsWith(searchTerm);
        const bStartsWith = bLower.startsWith(searchTerm);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Finally, sort alphabetically
        return aLower.localeCompare(bLower);
      });

      setFilteredCities(sortedResults.slice(0, 8)); // Show top 8 matches
      setShowDropdown(true);
    } else {
      setFilteredCities([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSearch(trimmedValue);
      setShowDropdown(false);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCitySelect = (city) => {
    setInputValue(city);
    onSearch(city);
    setShowDropdown(false);
  };

  // Highlight the matching text in the city name
  const highlightMatch = (city) => {
    const searchTerm = inputValue.trim().toLowerCase();
    const cityLower = city.toLowerCase();
    const index = cityLower.indexOf(searchTerm);
    
    if (index === -1) return city;
    
    return (
      <>
        {city.slice(0, index)}
        <span className={`${isDarkMode ? 'bg-purple-600 text-white' : 'bg-yellow-200 text-gray-800'} font-semibold`}>
          {city.slice(index, index + searchTerm.length)}
        </span>
        {city.slice(index + searchTerm.length)}
      </>
    );
  };

  return (
    <div className="relative w-full animate-fadeIn" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className={`flex w-full shadow-lg rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl`}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter city (e.g., Mumbai, Delhi)"
          aria-label="Enter city name"
          className={`flex-grow px-3 sm:px-5 py-2 sm:py-3 focus:outline-none text-sm sm:text-base md:text-lg ${
            isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-400'
          }`}
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transform hover:scale-105"
        >
          Search
        </button>
      </form>

      {/* Dropdown with city recommendations */}
      {showDropdown && filteredCities.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden animate-fadeInDown ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          {filteredCities.map((city, index) => (
            <button
              key={`${city}-${index}`}
              onClick={() => handleCitySelect(city)}
              className={`w-full px-4 py-2 text-left focus:outline-none text-sm sm:text-base transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {highlightMatch(city)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
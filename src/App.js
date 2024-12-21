import React, { useEffect, useState, useRef } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastDay from './components/ForecastDay';
import './App.css';
import { getWeatherBackgroundClass } from './utils/weatherBackground';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [location, setLocation] = useState({
    lat: 52.2297,
    lon: 21.0122,
    name: 'Warsaw, Poland'
  });

  const [timezone, setTimezone] = useState('UTC');
  const [localTime, setLocalTime] = useState('');

  const suggestionsRef = useRef(null);

  async function fetchWeather() {
    setLoading(true);
    try {
      // Dodajemy precipitation do parametru hourly
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,precipitation,relativehumidity_2m,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=auto`
      );
      const data = await response.json();

      if (data.timezone) {
        setTimezone(data.timezone);
      }

      const current = {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        weathercode: data.current_weather.weathercode,
        humidity: data.hourly.relativehumidity_2m[0],
      };

      const dailyData = data.daily;
      const forecastDays = dailyData.time.map((day, idx) => ({
        date: day,
        weathercode: dailyData.weathercode[idx],
        temp_max: dailyData.temperature_2m_max[idx],
        temp_min: dailyData.temperature_2m_min[idx],
        windspeed: dailyData.windspeed_10m_max[idx],
        winddirection: dailyData.winddirection_10m_dominant[idx]
      }));

      setForecast(forecastDays);

      const now = new Date();
      // Dane godzinowe temperatury:
      const hourDataTemp = data.hourly.time.map((t, i) => ({ time: t, value: data.hourly.temperature_2m[i] }));
      const upcomingHoursTemp = hourDataTemp.filter(h => new Date(h.time) > now).slice(0, 12);
      if (upcomingHoursTemp.length === 0 && hourDataTemp.length > 0) {
        upcomingHoursTemp.push(...hourDataTemp.slice(-12));
      }

      // Dane godzinowe opadów:
      const hourDataPrecip = data.hourly.time.map((t, i) => ({ time: t, value: data.hourly.precipitation[i] }));
      const upcomingHoursPrecip = hourDataPrecip.filter(h => new Date(h.time) > now).slice(0, 12);
      if (upcomingHoursPrecip.length === 0 && hourDataPrecip.length > 0) {
        upcomingHoursPrecip.push(...hourDataPrecip.slice(-12));
      }

      setCurrentWeather({
        ...current,
        hourlyTemp: upcomingHoursTemp,
        hourlyPrecip: upcomingHoursPrecip
      });
    } catch (error) {
      console.error('Error fetching weather data', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    async function fetchSuggestions() {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [searchQuery]);

  function handleSuggestionClick(city) {
    setLocation({
      lat: city.latitude,
      lon: city.longitude,
      name: `${city.name}, ${city.country_code}`
    });
    setSearchQuery('');
    setSuggestions([]);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update local time based on timezone every minute
  useEffect(() => {
    function updateLocalTime() {
      const now = new Date();
      const localString = now.toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
      setLocalTime(localString);
    }

    updateLocalTime();
    const interval = setInterval(updateLocalTime, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (loading) {
    return <div className="App">Loading weather data...</div>;
  }

  const backgroundClass = currentWeather ? getWeatherBackgroundClass(currentWeather.weathercode) : 'cloudy';

  return (
    <div className={`App ${backgroundClass}`}>
      <header>
        <div className="header-box">
          <h1>🌤️Weather Forecast</h1>
          <h2>{location.name}{localTime && ` | Local Time: ${localTime}`}</h2>
          <div className="search-container" ref={suggestionsRef}>
            <input 
              type="text" 
              placeholder="Enter city name..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((city, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick(city)}>
                    {city.name}, {city.country_code}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>
      <main>
        {currentWeather && (
          <CurrentWeather 
            temperature={currentWeather.temperature}
            humidity={currentWeather.humidity}
            windspeed={currentWeather.windspeed}
            winddirection={currentWeather.winddirection}
            weathercode={currentWeather.weathercode}
            hourlyTemp={currentWeather.hourlyTemp}
            hourlyPrecip={currentWeather.hourlyPrecip}
            timezone={timezone}
          />
        )}
        <section className="forecast">
          {forecast && forecast.slice(0,7).map((day, idx) => (
            <ForecastDay
              key={idx}
              date={day.date}
              weathercode={day.weathercode}
              temp_max={day.temp_max}
              temp_min={day.temp_min}
              windspeed={day.windspeed}
              winddirection={day.winddirection}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;

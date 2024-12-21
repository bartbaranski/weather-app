import React, { useState } from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';
import HourlyChart from './HourlyChart';

function CurrentWeather({ temperature, humidity, windspeed, winddirection, weathercode, hourlyTemp, hourlyPrecip, timezone }) {
  const icon = getWeatherIcon(weathercode);
  const [chartType, setChartType] = useState('temperature'); // 'temperature' or 'precipitation'

  const arrowStyle = {
    display: 'inline-block',
    transform: `rotate(${winddirection}deg)`,
    transition: 'transform 0.2s ease',
    fontSize: '1.5em'
  };

  let chartData = [];
  if (chartType === 'temperature') {
    chartData = hourlyTemp || [];
  } else {
    chartData = hourlyPrecip || [];
  }

  return (
    <div className="current-weather">
      <h3>Current Weather</h3>
      <div className="weather-container">
        <div className="current-weather-info">
          <div className="icon">
            {icon}
          </div>
          <div className="details">
            <p>Temperature: {temperature} °C</p>
            <p>Humidity: {humidity}%</p>
            <p>
              Wind: {windspeed} m/s
              <span style={arrowStyle}>↑</span>
            </p>
          </div>
          
        </div>
        
        {chartData.length > 0 && (
          <div className="hourly-chart-small">
            <div className="chart-buttons" >
            <button onClick={() => setChartType('temperature')}>
              Temperature
            </button>
            <button onClick={() => setChartType('precipitation')}>
              Precipitation
            </button>
          </div>
            <HourlyChart data={chartData} timezone={timezone} chartType={chartType} />
            
          </div>
        )}

          
      </div>
    </div>
  );
}

export default CurrentWeather;

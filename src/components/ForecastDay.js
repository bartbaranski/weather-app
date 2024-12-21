import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

function ForecastDay({ date, weathercode, temp_max, temp_min, windspeed, winddirection }) {
  const icon = getWeatherIcon(weathercode);
  const dayDate = new Date(date);
  const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

  const arrowStyle = {
    display: 'inline-block',
    transform: `rotate(${winddirection}deg)`,
    transition: 'transform 0.2s ease',
    fontSize: '1.5em'
  };

  return (
    <div className="forecast-day">
      <h4>{dayName} <p>{date}</p></h4>
      <div className="day-weather">
        <div className="icon">
          {icon}
        </div>
        <p style={{ color: '#000' }}>{Math.round(temp_max)} °C</p>    {/* Maksymalna temperatura bez przecinka */}
        <p style={{ color: '#888' }}>{Math.round(temp_min)} °C</p>    {/* Minimalna temperatura bez przecinka */}
        <p>
          Wind: {windspeed} m/s
          <span style={arrowStyle}>&nbsp;&nbsp;↑&nbsp;&nbsp;</span>
        </p>
      </div>
    </div>
  );
}

export default ForecastDay;

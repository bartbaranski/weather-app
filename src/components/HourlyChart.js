import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function HourlyChart({ data, timezone, chartType }) {
  const labels = data.map(d => {
    const date = new Date(d.time);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: false
    });
  });

  const values = data.map(d => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: chartType === 'temperature' ? 'Temperature (°C)' : 'Precipitation (mm)',
        data: values,
        fill: false,
        borderColor: chartType === 'temperature' ? 'red' : 'blue',
        backgroundColor: chartType === 'temperature' ? 'red' : 'blue',
        borderWidth: 3,
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: chartType === 'temperature' ? '°C' : 'mm'
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {chartType === 'temperature' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

export default HourlyChart;

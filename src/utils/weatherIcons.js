// Mapowanie kodów pogody z Open-Meteo na proste emoji
// Kody i ich znaczenie: https://open-meteo.com/en/docs#api_weathercode
//
// Przykładowe kody:
// 0 = Clear sky
// 1-3 = Mainly clear, partly cloudy, and overcast
// 45-48 = Fog
// 51-55 = Drizzle
// 56-57 = Freezing drizzle
// 61-65 = Rain
// 66-67 = Freezing rain
// 71-75 = Snow fall
// 77 = Snow grains
// 80-82 = Rain showers
// 85-86 = Snow showers
// 95 = Thunderstorm
// 96-99 = Thunderstorm with hail

export function getWeatherIcon(weathercode) {
    if (weathercode === 0) {
      return '☀️'; // słonecznie, bezchmurnie
    } else if (weathercode >= 1 && weathercode <= 3) {
      return '🌤️'; // lekkie do umiarkowanego zachmurzenia
    } else if (weathercode >= 45 && weathercode <= 48) {
      return '🌫️'; // mgła
    } else if (weathercode >= 51 && weathercode <= 55) {
      return '🌦️'; // mżawka
    } else if (weathercode >= 56 && weathercode <= 57) {
      return '🌧️❄️'; // marznąca mżawka
    } else if (weathercode >= 61 && weathercode <= 65) {
      return '🌧️'; // deszcz
    } else if (weathercode >= 66 && weathercode <= 67) {
      return '🌧️❄️'; // marznący deszcz
    } else if (weathercode >= 71 && weathercode <= 75) {
      return '❄️'; // opady śniegu
    } else if (weathercode === 77) {
      return '❄️'; // drobinki śniegu
    } else if (weathercode >= 80 && weathercode <= 82) {
      return '🌧️'; // przelotne opady deszczu
    } else if (weathercode >= 85 && weathercode <= 86) {
      return '🌨️'; // przelotne opady śniegu
    } else if (weathercode === 95) {
      return '⛈️'; // burza
    } else if (weathercode >= 96 && weathercode <= 99) {
      return '⛈️❄️'; // burza z gradem lub intensywniejsze warunki
    } else {
      return '☁️'; // domyślnie chmury
    }
  }
  
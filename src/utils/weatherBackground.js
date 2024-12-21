// Funkcja mapująca weathercode na klasę tła.
// Wykorzystuje kody pogody z Open-Meteo: https://open-meteo.com/en/docs#api_weathercode
export function getWeatherBackgroundClass(weathercode) {
    if (weathercode === 0) {
      return 'clear'; // bezchmurne niebo
    } else if (weathercode >= 1 && weathercode <= 3) {
      return 'cloudy'; // lekkie / umiarkowane zachmurzenie
    } else if (weathercode >= 45 && weathercode <= 48) {
      return 'foggy'; // mgła
    } else if (
      (weathercode >= 51 && weathercode <= 67) ||
      (weathercode >= 80 && weathercode <= 82)
    ) {
      return 'rain'; // mżawka / deszcz
    } else if (
      (weathercode >= 71 && weathercode <= 77) ||
      (weathercode >= 85 && weathercode <= 86)
    ) {
      return 'snow'; // śnieg / śnieżyce
    } else if (weathercode >= 95 && weathercode <= 99) {
      return 'storm'; // burza
    } else {
      return 'cloudy'; // domyślnie zachmurzenie
    }
  }
  
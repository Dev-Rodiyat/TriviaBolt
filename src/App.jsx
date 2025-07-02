import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('weather_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeather(res.data);
        setCity(res.data.name);
        setError('');
      } catch {
        setError('Failed to fetch your location weather.');
      }
    });
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setCity(res.data.name);
      setError('');
    } catch {
      setError('City not found.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const getLocalTime = (timezoneOffset) => {
    const local = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 + timezoneOffset * 1000);
    return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFlagUrl = (countryCode) =>
    `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;

  const formatUnixTime = (unix, timezoneOffset) => {
    const date = new Date((unix + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBackgroundClass = () => {
    if (!weather) return 'from-sky-400 to-blue-600';
    const hour = new Date(Date.now() + weather.timezone * 1000).getUTCHours();
    const condition = weather.weather[0].main.toLowerCase();

    let timeOfDay = 'day';
    if (hour < 6 || hour >= 20) timeOfDay = 'night';
    else if (hour >= 6 && hour < 10) timeOfDay = 'morning';
    else if (hour >= 17 && hour < 20) timeOfDay = 'evening';

    if (condition.includes('rain')) return 'from-gray-700 to-blue-800';
    if (condition.includes('snow')) return 'from-blue-200 to-blue-500';
    if (condition.includes('cloud')) return 'from-slate-400 to-gray-600';
    if (condition.includes('clear') && timeOfDay === 'night') return 'from-indigo-900 to-slate-800';

    return timeOfDay === 'morning'
      ? 'from-yellow-200 to-sky-400'
      : timeOfDay === 'evening'
        ? 'from-orange-400 to-pink-500'
        : timeOfDay === 'night'
          ? 'from-gray-900 to-slate-800'
          : 'from-sky-400 to-blue-600';
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${getBackgroundClass()} flex items-center justify-center px-4 pt-24`}>
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 w-full text-center"
      >
        <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">
          🌍 WeatherNow
        </h1>
        <p className="text-sm text-white/70 mt-1">
          Real-time forecasts, local time, and favorites
        </p>
      </motion.header>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-md w-full text-white">
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city..."
            className="w-full px-3 py-2 rounded bg-white/20 placeholder-white outline-none"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 hover:bg-blue-600 px-4 rounded"
          >
            Search
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-white block mb-1">
              ⭐ Select Favorite City:
            </label>
            <select
              className="w-full bg-white/20 text-white px-3 py-2 rounded outline-none backdrop-blur-sm"
              onChange={async (e) => {
                const selected = e.target.value;
                if (!selected) return;
                try {
                  const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${selected}&appid=${API_KEY}&units=metric`
                  );
                  setWeather(res.data);
                  setCity(res.data.name);
                  setError('');
                } catch {
                  setError('Failed to load favorite');
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                -- Select City --
              </option>
              {favorites.map((fav) => (
                <option key={fav} value={fav}>
                  {fav}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="mt-4 text-red-300 text-sm">{error}</p>}

        {weather && (
          <div className="mt-6 text-center space-y-2">
            <div className="flex justify-center items-center gap-2">
              <h2 className="text-2xl font-semibold">
                {weather.name}, {weather.sys.country}
              </h2>
              <img
                src={getFlagUrl(weather.sys.country)}
                alt={weather.sys.country}
                className="w-6 h-5 rounded shadow"
              />
            </div>

            <p className="text-sm text-gray-200">
              Local Time: {getLocalTime(weather.timezone)}
            </p>

            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <p className="text-xl">{weather.main.temp}°C</p>
            <p>{weather.weather[0].main}</p>

            <p className="text-sm text-gray-200">
              Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
            </p>

            <div className="text-sm text-gray-200">
              <p>🌅 Sunrise: {formatUnixTime(weather.sys.sunrise, weather.timezone)}</p>
              <p>🌇 Sunset: {formatUnixTime(weather.sys.sunset, weather.timezone)}</p>
            </div>

            <p className="text-xs mt-1 text-gray-300">
              Lat: {weather.coord.lat}, Lon: {weather.coord.lon}
            </p>

            {!favorites.includes(weather.name) ? (
              <button
                className="mt-2 text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                onClick={() => setFavorites([...favorites, weather.name])}
              >
                ⭐ Save to Favorites
              </button>
            ) : (
              <button
                className="mt-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                onClick={() => setFavorites(favorites.filter((c) => c !== weather.name))}
              >
                🗑️ Remove from Favorites
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
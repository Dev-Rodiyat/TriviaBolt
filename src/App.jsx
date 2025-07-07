import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [forecast, setForecast] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [loading, setLoading] = useState(false);
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
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeather(res.data);
        setForecast(forecastRes.data.list);
        setCity(res.data.name);
        setError('');
      } catch {
        setError('Failed to fetch your location weather.');
      }
    });
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      ]);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list);
      setCity(weatherRes.data.name);
      setError('');
    } catch {
      setError('City not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const getLocalTime = (timezoneOffset) => {
    const local = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 + timezoneOffset * 1000);
    return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFlagUrl = (countryCode) => {
    if (!countryCode) return '';
    return `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
  };

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

  const getDailyForecast = () => {
    if (!forecast.length) return [];
    const daily = forecast.filter((item) => item.dt_txt.includes("12:00:00"));
    return daily.slice(0, 5);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!city) return setSuggestions([]);

      try {
        const res = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching city suggestions', err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setCity(res.data.name);
      setError('');
    } catch (err) {
      console.error('Error fetching weather', err);
      setError('Could not get weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) setSuggestions([]);
  }, [city]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600">
        <ClipLoader loading={loading} size={50} color="#fff" />
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${getBackgroundClass()} flex items-center justify-center px-4 pt-24`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 w-full text-center"
      >
        <h1 className="lg:text-5xl text-3xl font-extrabold text-white tracking-wide drop-shadow-xl">🌍 WeatherNow</h1>
        <p className="text-base text-white/70 mt-1">Real-time forecasts, local time, and favorites</p>
      </motion.header>

      {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white border border-white/20">
        {/* Search */}
        <div className="relative">
          <div className="flex gap-2 mb-4">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 100)} // delay to allow click
              placeholder="Search city..."
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {city && (
              <button
                onClick={() => setCity('')}
                className="px-3 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 transition"
                title="Clear"
              >
                ✕
              </button>
            )}
            <button
              onClick={fetchWeather}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg transition"
            >
              Search
            </button>
          </div>

          {/* Auto-suggest dropdown */}
          {isInputFocused && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white text-black w-full rounded shadow mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={async () => {
                    setCity(s.name); // only the city name in the input
                    setSuggestions([]);
                    await fetchWeatherByCoords(s.lat, s.lon); // fetch full weather from coords
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {s.name}, {s.state ? `${s.state}, ` : ''}{s.country}
                </li>

              ))}
            </ul>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="mb-4 mt-2">
            <label className="text-sm font-medium mb-1 block text-white/80">⭐ Select Favorite City:</label>
            <select
              className="w-full bg-white/10 text-white placeholder-white px-3 py-2 rounded-lg outline-none backdrop-blur-sm ring-1 ring-white/30 focus:ring-2 focus:ring-blue-400 transition"
              onChange={async (e) => {
                const selected = e.target.value;
                if (!selected) return;
                try {
                  const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selected}&appid=${API_KEY}&units=metric`);
                  setWeather(res.data);
                  setCity(res.data.name);
                  setError('');
                } catch {
                  setError('Failed to load favorite');
                }
              }}
              defaultValue=""
            >
              <option value="" disabled className="bg-gray-800 text-white">-- Select City --</option>
              {favorites.map((fav) => (
                <option key={fav} value={fav} className="bg-gray-800 text-white">
                  {fav}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Forecast Toggle */}
        {forecast.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">5-Day Forecast</h3>
              <button
                onClick={() => setShowForecast(!showForecast)}
                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition"
              >
                {showForecast ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            </div>

            {showForecast && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {getDailyForecast().map((day, index) => (
                  <div key={index} className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-center backdrop-blur-sm transition shadow">
                    <p className="text-sm font-medium">
                      {new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                      className="mx-auto my-1 w-12 h-12"
                    />
                    <p className="text-base font-semibold">{Math.round(day.main.temp)}°C</p>
                    <p className="text-xs text-white/80">{day.weather[0].main}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        {/* Weather Display */}
        {weather && (
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center gap-2">
              <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
              {console.log({ weather })}
              <img
                src={getFlagUrl(weather.sys.country)}
                alt={weather.sys.country}
                className="w-6 h-5 rounded shadow"
              />
            </div>

            <p className="text-sm text-white/70">Local Time: {getLocalTime(weather.timezone)}</p>

            <img
              className="mx-auto w-20 h-20"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <p className="text-3xl font-semibold">{weather.main.temp}°C</p>
            <p className="text-lg">{weather.weather[0].main}</p>

            <p className="text-sm text-white/70">
              💧 {weather.main.humidity}% | 💨 {weather.wind.speed} m/s
            </p>

            <div className="text-sm text-white/70">
              <p>🌅 Sunrise: {formatUnixTime(weather.sys.sunrise, weather.timezone)}</p>
              <p>🌇 Sunset: {formatUnixTime(weather.sys.sunset, weather.timezone)}</p>
            </div>

            <p className="text-xs text-white/50 mt-2">Lat: {weather.coord.lat}, Lon: {weather.coord.lon}</p>

            {!favorites.includes(weather.name) ? (
              <button
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                onClick={() => setFavorites([...favorites, weather.name])}
              >
                ⭐ Save to Favorites
              </button>
            ) : (
              <button
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
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
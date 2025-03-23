import React, { useState } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=7a479134a435e8829a1a720378b30255&units=metric`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "City not found.");
      }

      const data = await response.json();
      setWeather({
        location: {
          name: data.name,
          country: data.sys.country,
        },
        current: {
          temp_c: data.main.temp,
          humidity: data.main.humidity,
          wind_kph: (data.wind.speed * 3.6).toFixed(2), // Convert m/s to km/h
          condition: {
            text: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          },
        },
      });
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>

        <input
          type="text"
          placeholder="Enter city name"
          className="border p-[5px] rounded w-full mb-4 "
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={fetchWeather}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Get Weather
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {weather && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">
              {weather.location.name}, {weather.location.country}
            </h2>
            <p className="text-lg">
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                className="inline-block"
              />{" "}
              {weather.current.condition.text}
            </p>
            <p className="text-lg">🌡 {weather.current.temp_c}°C</p>
            <p className="text-lg">💧 Humidity: {weather.current.humidity}%</p>
            <p className="text-lg">💨 Wind: {weather.current.wind_kph} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;

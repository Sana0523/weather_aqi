"use client";
import axios from "axios";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { Search, Wind, Eye, Droplets, Thermometer, Loader2, MapPin } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  // 1. Convert city name to coordinates
  const fetchAqi = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAqi(null);
    setWeather(null);
    setError(null);
    
    try {
      // Check if API key exists
      if (!WEATHER_KEY) {
        throw new Error("API key is missing. Please check your environment variables.");
      }
      
      // Check if city is entered
      if (!city.trim()) {
        throw new Error("Please enter a city name.");
      }
      
      console.log('Searching for city:', city);
      const coords = await getCoordinates(city);
      console.log('Coordinates found:', coords);
      
      // Fetch both AQI and weather data in parallel
      const [aqiRes, weatherRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_KEY}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_KEY}&units=metric`
        )
      ]);

      console.log('AQI Response:', aqiRes.data);
      console.log('Weather Response:', weatherRes.data);
      
      // Set AQI data (OpenWeather returns 1-5 scale, we'll convert to US EPA scale)
      const aqiValue = aqiRes.data?.list?.[0]?.main?.aqi;
      const components = aqiRes.data?.list?.[0]?.components || {};
      
      // Convert OpenWeather AQI (1-5) to approximate US EPA AQI (0-500)
      const convertedAqi = convertOpenWeatherAqi(aqiValue, components.pm2_5);
      
      setAqi({
        value: convertedAqi,
        level: aqiValue,
        components: components,
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        no2: components.no2,
        o3: components.o3,
        co: components.co,
        so2: components.so2
      });
  
      // Set weather data
      setWeather(weatherRes.data);
      
    } catch (err) {
      console.error('Detailed error:', err);
      
      // More specific error messages
      if (err.response) {
        // API returned an error response
        const status = err.response.status;
        const message = err.response.data?.message || 'Unknown API error';
        
        if (status === 401) {
          setError("Invalid API key. Please check your OpenWeatherMap API key.");
        } else if (status === 404) {
          setError("City not found. Please check the spelling and try again.");
        } else if (status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError(`API Error (${status}): ${message}`);
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your internet connection.");
      } else {
        // Other errors
        setError(err.message);
      }
      
      setAqi(null);
      setWeather(null);
    }
    
    setCity("");
    setLoading(false);
  };
  
  // Convert OpenWeather AQI (1-5) to US EPA AQI scale (0-500)
  const convertOpenWeatherAqi = (owAqi, pm2_5) => {
    // If we have PM2.5 data, calculate more accurate AQI
    if (pm2_5 !== undefined) {
      if (pm2_5 <= 12) return Math.round((50 / 12) * pm2_5);
      if (pm2_5 <= 35.4) return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm2_5 - 12.1));
      if (pm2_5 <= 55.4) return Math.round(100 + ((150 - 100) / (55.4 - 35.5)) * (pm2_5 - 35.5));
      if (pm2_5 <= 150.4) return Math.round(150 + ((200 - 150) / (150.4 - 55.5)) * (pm2_5 - 55.5));
      if (pm2_5 <= 250.4) return Math.round(200 + ((300 - 200) / (250.4 - 150.5)) * (pm2_5 - 150.5));
      return Math.round(300 + ((500 - 300) / (500.4 - 250.5)) * (pm2_5 - 250.5));
    }
    
    // Fallback: approximate conversion from OpenWeather scale
    const aqiMap = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
    return aqiMap[owAqi] || 0;
  };
  
  // 3. IMPROVED getCoordinates FUNCTION
  const getCoordinates = async (city) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${WEATHER_KEY}`;
    
    console.log('Geocoding URL:', url);
    const res = await axios.get(url);
    console.log('Geocoding response:', res.data);
    
    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return { lat, lon };
    }
    throw new Error("City not found. Please check the spelling and try again.");
  };

  // Color & label for AQI (US EPA scale)
  const getAqiStatus = (aqiValue) => {
    if (!aqiValue) return { label: "--", color: "text-white", bgColor: "bg-gray-500" };
    
    if (aqiValue <= 50)
      return { label: "Good", color: "text-green-400", bgColor: "bg-green-500" };
    if (aqiValue <= 100)
      return { label: "Moderate", color: "text-yellow-400", bgColor: "bg-yellow-500" };
    if (aqiValue <= 150)
      return { label: "Unhealthy for Sensitive Groups", color: "text-orange-400", bgColor: "bg-orange-500" };
    if (aqiValue <= 200)
      return { label: "Unhealthy", color: "text-red-400", bgColor: "bg-red-500" };
    if (aqiValue <= 300)
      return { label: "Very Unhealthy", color: "text-purple-400", bgColor: "bg-purple-500" };
    
    return { label: "Hazardous", color: "text-red-600", bgColor: "bg-red-700" };
  };

  const aqiStatus = getAqiStatus(aqi?.value);

  return (
    <div>
      <div className="w-full min-h-screen overflow-auto relative">
        <Head>
          <title>Air Quality Index App</title>
        </Head>

        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Air quality"
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0 z-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80" />
        
        {/* Content */}
        <div
          className="relative z-20 h-full flex flex-col"
          style={{ paddingTop: "32px" }} 
        >
          {/* Header */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="text-center mb-8 max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">Air Quality</h1>
              </div>
              <p className="text-xl sm:text-2xl text-white/90 font-light mb-2">Monitor air quality in real-time</p>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Get instant access to air quality data for any city worldwide. Stay informed about pollution levels and
                protect your health.
              </p>
            </div>

            {/* Current Location Display */}
            {weather && (
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{weather.name}, {weather.sys.country}</span>
              </div>
            )}

            {/* Search Section */}
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
              <div className="p-6">
                <form onSubmit={fetchAqi} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter city name (e.g., New York, London, Tokyo)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/5 border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Get Air Quality Data"
                    )}
                  </button>
                </form>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                <div className="p-4 text-center">
                  <Eye className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {weather ? `${Math.round((weather.visibility || 10000) / 1000)} km` : "--"}
                  </div>
                  <div className="text-white/70 text-sm">Visibility</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                <div className="p-4 text-center">
                  <Droplets className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {weather ? `${weather.main.humidity}%` : "--"}
                  </div>
                  <div className="text-white/70 text-sm">Humidity</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                <div className="p-4 text-center">
                  <Wind className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {weather ? `${weather.wind.speed} m/s` : "--"}
                  </div>
                  <div className="text-white/70 text-sm">Wind Speed</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                <div className="p-4 text-center">
                  <Thermometer className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {weather ? `${Math.round(weather.main.temp)}°C` : "--"}
                  </div>
                  <div className="text-white/70 text-sm">Temperature</div>
                </div>
              </div>
            </div>

            {/* AQI Display Card */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Air Quality Index</h2>
                  <div className={`text-6xl font-bold mb-2 ${aqiStatus.color}`}>
                    {aqi ? aqi.value : "--"}
                  </div>
                  <div className="text-white/70 text-lg mb-4">
                    {aqi ? (
                      <>
                        <span className={`font-semibold ${aqiStatus.color}`}>
                          {aqiStatus.label}
                        </span>
                        {weather && (
                          <div className="text-sm mt-2 text-white/60">
                            {weather.weather[0].description}
                          </div>
                        )}
                      </>
                    ) : (
                      "Select a city to view AQI"
                    )}
                  </div>

                  {/* Pollutant Details */}
                  {aqi && aqi.components && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-sm">
                      {aqi.pm2_5 && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">PM2.5</div>
                          <div className="text-white font-semibold">{aqi.pm2_5.toFixed(1)} μg/m³</div>
                        </div>
                      )}
                      {aqi.pm10 && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">PM10</div>
                          <div className="text-white font-semibold">{aqi.pm10.toFixed(1)} μg/m³</div>
                        </div>
                      )}
                      {aqi.no2 && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">NO₂</div>
                          <div className="text-white font-semibold">{aqi.no2.toFixed(1)} μg/m³</div>
                        </div>
                      )}
                      {aqi.o3 && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">O₃</div>
                          <div className="text-white font-semibold">{aqi.o3.toFixed(1)} μg/m³</div>
                        </div>
                      )}
                      {aqi.co && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">CO</div>
                          <div className="text-white font-semibold">{(aqi.co / 1000).toFixed(2)} mg/m³</div>
                        </div>
                      )}
                      {aqi.so2 && (
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-white/70">SO₂</div>
                          <div className="text-white font-semibold">{aqi.so2.toFixed(1)} μg/m³</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center space-x-4 text-sm mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white/70">Good (0-50)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-white/70">Moderate (51-100)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-white/70">Unhealthy (101+)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center">
            <p className="text-white/60 text-sm">Data provided by environmental monitoring stations worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
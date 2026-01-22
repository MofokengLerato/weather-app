
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export const getForecastWeather = async (query, days = 5) => {
  try {



    const response = await fetch(
      `${BASE_URL}?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${query}&days=${days}&aqi=no&alerts=no`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast weather data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API error:', error);

    throw error;
  }
};

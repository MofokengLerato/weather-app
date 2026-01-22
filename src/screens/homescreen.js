import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  useColorScheme,
  Switch,
} from 'react-native';
import { getForecastWeather } from '../services/weatherapi';
import * as Location from 'expo-location';
import AppBar from '../components/appBar';


export default function HomeScreen() {
  
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState('Pretoria');
  const [locationData, setLocationData] = useState(null); 
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  const colors = {
    backgroundColor: isDarkMode ? '#020617' : '#f8fafc',
    card: isDarkMode ? '#0f172a' : '#ffffff',
    text: isDarkMode ? '#e5e7eb' : '#020617',
    subText: isDarkMode ? '#94a3b8' : '#475569',
    accent: '#38bdf8',
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      setError(null);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      fetchWeather();
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = userLocation.coords;

    const data = await getForecastWeather(`${latitude},${longitude}`,5);
    
    setWeather(data.current);
    setLocationData(data.location);
    setForecast(data.forecast.forecastday);
  } catch (error) {
    fetchWeather();
  }finally {
    setLoading(false);}


  }

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getForecastWeather(location,5);
      setWeather(data.current);
      setLocationData(data.location);
      setForecast(data.forecast.forecastday);
    } catch (err) {
      setError('Location not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    setRefreshing(false);
  }

  
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
    
    <AppBar
      isDarkMode={isDarkMode}
      toggleTheme={() => setIsDarkMode(prev => !prev)}
      colors={colors}
    />
   
     
        <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.backgroundColor }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#94a3b8"
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.button} onPress={fetchWeather}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

      {/* Loading State */}
      {loading && <ActivityIndicator size="large" color="#38bdf8" />}

      {/* Error State */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Weather Display */}
      {weather && !loading && !error && (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.location, { color: colors.text }]}>{locationData?.name}</Text>
        <Text style={{ color: colors.subText, marginBottom: 5 }}>
  Current location
</Text>

          <Image
      source={{ uri: `https:${weather.condition.icon}` }}
      style={styles.icon}
    />
        <Text style={[styles.temp, { color: colors.text }]}>
          {weather.temp_c}°C
        </Text>
        <Text style={[styles.condition, { color: colors.subText }]}>
          {weather.condition.text}
        </Text>
      
      </View>
      )}

      <View style={styles.forecastContainer}>
      {forecast.map((day) => (
        <View
          key={day.date}
          style={[styles.forecastItem, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', })}
          </Text>
          <Image
            source={{ uri: `https:${day.day.condition.icon}` }}
            style={styles.forecastIcon}
          />
          <Text style={{ color: colors.text }}>
            {day.day.avgtemp_c}°C
          </Text>
        </View>
      ))}
      </View>
  </ScrollView>
</View>

    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingBottom: 20,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
    borderRadius: 10,
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastIcon:{
width:40,
height:40,

  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  themeToggle: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#1e293b',
    height: 40,
    borderColor: '#38bdf8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#38bdf8',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 26,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginVertical: 10,
  },
  condition: {
    fontSize: 16,
    color: '#94a3b8',
  },
  icon: {
  width: 100,
  height: 100,
  marginVertical: 10,
},
card: {
  backgroundColor: '#020617',
  width: '90%',
  borderRadius: 20,
  alignItems: 'center',
  paddingVertical: 30,
  marginTop: 20,
  shadowColor: '#000',
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 10,
},

  error: {
    color: '#f87171',
    fontSize: 16,
    marginTop: 10,
  },
});

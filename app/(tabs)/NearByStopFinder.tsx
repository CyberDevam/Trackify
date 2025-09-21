import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'; // Import axios
import { useUser } from '../context/userContext';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// You will need to install a geolocation library, e.g., 'react-native-geolocation-service'
// This is a placeholder function; you would replace it with actual library logic.
// Don't forget to request location permissions in your app's native settings!
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Location Service",
      "This is a placeholder for your geolocation library. In a real app, this would get your coordinates automatically. We will use dummy coordinates for now.",
      [
        {
          text: "OK",
          onPress: () => resolve({ latitude: 11.0168, longitude: 76.9558 }),
        },
      ]
    );
  });
};

interface Coordinates {
  lat: number;
  long: number;
}

interface Stop {
  _id: string;
  name: string;
  coordinates: Coordinates;
}

interface ApiResponse {
  stop: Stop;
}

const NearbyStopFinder: React.FC = () => {

  const { ip, user } = useUser();
  const API_BASE_URL = `http://${ip}:4000/api/stops`;

  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foundStop, setFoundStop] = useState<Stop | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindStop = async () => {
    setError(null);
    setFoundStop(null);
    setLoading(true);

    // Validate coordinates
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    if (isNaN(lat) || isNaN(long)) {
      setError('Please enter valid numerical coordinates.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/nearbyStop`, {
        params: {
          lat: lat,
          long: long,
        },
      });

      if (response.status === 200 && response.data) {
        setFoundStop(response.data.stop);
      } else {
        // This block handles successful HTTP status codes (e.g., 200) but unexpected data.
        setError('No nearby stop found or an unexpected data format was received.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx.
          const contentType = err.response.headers['content-type'];
          if (contentType && contentType.includes('text/html')) {
            setError(`Server responded with an HTML error page. Status: ${err.response.status}`);
          } else {
            // This case handles a non-200 JSON response, which your API might return.
            setError(`Error: ${err.response.status} - ${err.response.data.error || 'Server error'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received.
          setError('Network error. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error.
          setError('Failed to make the request. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      const { latitude: userLat, longitude: userLong } = await getCurrentLocation();
      setLatitude(userLat.toString());
      setLongitude(userLong.toString());
    } catch (err) {
      setError('Could not get your location. Please enter coordinates manually.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Get Nearby Stop</Text>
        <Text style={styles.subHeader}>Find the closest bus stop to your location.</Text>

        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Latitude</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            keyboardType="numeric"
            value={latitude}
            onChangeText={setLatitude}
          />
        </View>
        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Longitude</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            keyboardType="numeric"
            value={longitude}
            onChangeText={setLongitude}
          />
        </View>

        {/* <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
          <Text style={styles.locationButtonText}>Use Current Location</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.findButton}
          onPress={handleFindStop}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.findButtonText}>Find Nearby Stop</Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {foundStop && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Closest Bus Stop Found:</Text>
            <Text style={styles.resultText}>Stop Name: {foundStop.name}</Text>
            <Text style={styles.resultText}>
              Coordinates: Lat {foundStop.coordinates.lat}, Long {foundStop.coordinates.long}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  findButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default NearbyStopFinder;

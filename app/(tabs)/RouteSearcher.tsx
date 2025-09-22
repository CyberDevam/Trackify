// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
//   TextInput,
// } from 'react-native';
// import { io, Socket } from 'socket.io-client';
// import { useUser } from '../context/userContext';

// interface BusLocation {
//   busNumber: string;
//   lat: number;
//   long: number;
//   updatedAt: string;
// }

// const BusTracker: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = 'http://localhost:4000'; // Socket.IO connects to the root URL

//   const [loading, setLoading] = useState<boolean>(false);
//   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [busNumberInput, setBusNumberInput] = useState('');

//   // Use a ref to store the Socket instance
//   const socketRef = useRef<Socket | null>(null);

//   const startTracking = () => {
//     // Basic validation to prevent tracking an empty bus number
//     const trimmedBusNumber = busNumberInput.trim();
//     if (!trimmedBusNumber) {
//       setError("Please enter a bus number to track.");
//       return;
//     }

//     setError(null);
//     setBusLocation(null);

//     // Clear any existing connection to prevent multiple trackers
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//     }
    
//     setLoading(true);

//     try {
//       // Create a Socket.IO connection
//       const socket = io(API_BASE_URL);
//       socketRef.current = socket;

//       socket.on('connect', () => {
//         console.log('Socket.IO connection opened:', socket.id);
//         setLoading(false);
//         // Once connected, we need to tell the server which bus we want to track
//         socket.emit('track-bus', trimmedBusNumber);
//       });

//       // Listen for the custom event from the server
//       socket.on('bus-location-update', (data: BusLocation) => {
//         if (data.busNumber === trimmedBusNumber) {
//           setBusLocation(data);
//           console.log("Received bus location update:", data);
//           setError(null);
//         }
//       });

//       socket.on('error', (err) => {
//         console.error('Socket.IO error:', err);
//         setError('Connection error. Please try again.');
//         setLoading(false);
//         setBusLocation(null);
//       });

//       socket.on('disconnect', () => {
//         console.log('Socket disconnected.');
//         setLoading(false);
//       });
//     } catch (e) {
//       console.error('Failed to create socket connection:', e);
//       setError('An error occurred during connection. Please check the server address.');
//       setLoading(false);
//     }
//   };

//   const stopTracking = () => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       setLoading(false);
//       Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
//     }
//   };

//   // Clean up the Socket.IO connection on component unmount
//   useEffect(() => {
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, []);


//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Bus Location Tracker</Text>
//         <Text style={styles.subHeader}>
//           Enter a bus number to track its real-time location.
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="e.g., BG-008-009"
//           value={busNumberInput}
//           onChangeText={setBusNumberInput}
//           autoCapitalize="none"
//           placeholderTextColor="#999"
//         />

//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={startTracking}
//           disabled={loading || socketRef.current?.connected}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.trackButtonText}>
//               {socketRef.current?.connected ? 'Tracking...' : 'Start Tracking'}
//             </Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.stopButton, !socketRef.current?.connected && styles.disabledButton]}
//           onPress={stopTracking}
//           disabled={!socketRef.current?.connected}
//         >
//           <Text style={styles.stopButtonText}>Stop Tracking</Text>
//         </TouchableOpacity>

//         {error && (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         {busLocation && (
//           <View style={styles.resultBox}>
//             <Text style={styles.resultTitle}>Bus Location:</Text>
//             <Text style={styles.resultText}>Bus Number: {busLocation.busNumber}</Text>
//             <Text style={styles.resultText}>Latitude: {busLocation.lat}</Text>
//             <Text style={styles.resultText}>Longitude: {busLocation.long}</Text>
//             <Text style={styles.resultText}>
//               Updated At: {new Date(busLocation.updatedAt).toLocaleTimeString()}
//             </Text>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   subHeader: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#fff',
//   },
//   trackButton: {
//     backgroundColor: '#2ecc71',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   trackButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   stopButton: {
//     backgroundColor: '#e74c3c',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   stopButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   errorBox: {
//     backgroundColor: '#e74c3c',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   resultBox: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginTop: 20,
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   resultText: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 24,
//   },
// });

// export default BusTracker;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useUser } from '../context/userContext';

interface BusLocation {
  busNumber: string;
  lat: number;
  long: number;
  updatedAt: string;
}

const BusTracker: React.FC = () => {
  const { ip } = useUser();
  const API_BASE_URL = `http://${ip}:4000`; // Correctly uses the server's IP

  const [loading, setLoading] = useState<boolean>(false);
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busNumberInput, setBusNumberInput] = useState('');

  // Use a ref to store the Socket instance
  const socketRef = useRef<Socket | null>(null);

  const startTracking = () => {
    // Basic validation to prevent tracking an empty bus number
    const trimmedBusNumber = busNumberInput.trim();
    if (!trimmedBusNumber) {
      setError("Please enter a bus number to track.");
      return;
    }

    setError(null);
    setBusLocation(null);

    // Clear any existing connection to prevent multiple trackers
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setLoading(true);

    try {
      // Create a Socket.IO connection
      const socket = io(API_BASE_URL);
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.IO connection opened:', socket.id);
        setLoading(false);
        // Once connected, we need to tell the server which bus we want to track
        socket.emit('track-bus', trimmedBusNumber);
      });

      // Listen for the custom event from the server
      socket.on('bus-location-update', (data: BusLocation) => {
        if (data.busNumber === trimmedBusNumber) {
          setBusLocation(data);
          console.log("Received bus location update:", data);
          setError(null);
        }
      });

      socket.on('error', (err) => {
        console.error('Socket.IO error:', err);
        setError('Connection error. Please try again.');
        setLoading(false);
        setBusLocation(null);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected.');
        // The loading state is already handled by stopTracking() or the
        // initial connection attempt, so we don't need to set it here.
      });
    } catch (e) {
      console.error('Failed to create socket connection:', e);
      setError('An error occurred during connection. Please check the server address.');
      setLoading(false);
    }
  };

  const stopTracking = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setLoading(false);
      Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
    }
  };

  // Clean up the Socket.IO connection on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Bus Location Tracker</Text>
        <Text style={styles.subHeader}>
          Enter a bus number to track its real-time location.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g., BG-008-009"
          value={busNumberInput}
          onChangeText={setBusNumberInput}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.trackButton}
          onPress={startTracking}
          disabled={loading || socketRef.current?.connected}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.trackButtonText}>
              {socketRef.current?.connected ? 'Tracking...' : 'Start Tracking'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.stopButton, !socketRef.current?.connected && styles.disabledButton]}
          onPress={stopTracking}
          disabled={!socketRef.current?.connected}
        >
          <Text style={styles.stopButtonText}>Stop Tracking</Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {busLocation && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Bus Location:</Text>
            <Text style={styles.resultText}>Bus Number: {busLocation.busNumber}</Text>
            <Text style={styles.resultText}>Latitude: {busLocation.lat}</Text>
            <Text style={styles.resultText}>Longitude: {busLocation.long}</Text>
            <Text style={styles.resultText}>
              Updated At: {new Date(busLocation.updatedAt).toLocaleTimeString()}
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
    padding: 20,
    justifyContent: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  trackButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
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

export default BusTracker;

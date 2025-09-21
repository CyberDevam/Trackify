// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   ActivityIndicator,
// //   Alert,
// // } from 'react-native';
// // import axios from 'axios';
// // import { useUser } from '../context/userContext';
// // // import { useUser } from '../context/UserContext';

// // interface BusLocation {
// //   busNumber: string;
// //   lat: number;
// //   long: number;
// //   updatedAt: string;
// // }

// // const BusTracker: React.FC = () => {
// //   const { ip } = useUser();
// //   const API_BASE_URL = `http://${ip}:4000/api/buses`;

// //   const [busNumber, setBusNumber] = useState<string>('');
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
// //   const [error, setError] = useState<string | null>(null);
// //   const intervalRef = useRef<NodeJS.Timeout | null>(null);

// //   const startTracking = async () => {
// //     setError(null);
// //     setBusLocation(null);

// //     if (!busNumber) {
// //       setError('Please enter a bus number.');
// //       return;
// //     }

// //     setLoading(true);

// //     // Clear any existing interval to prevent multiple simultaneous trackers
// //     if (intervalRef.current) {
// //       clearInterval(intervalRef.current);
// //     }

// //     const fetchLocation = async () => {
// //       try {
// //         const response = await axios.get<BusLocation>(`${API_BASE_URL}/streamBusLocation`, {
// //           params: { busNumber },
// //         });

// //         if (response.status === 200) {
// //           setBusLocation(response.data);
// //           setError(null);
// //         }
// //       } catch (err) {
// //         if (axios.isAxiosError(err)) {
// //           if (err.response) {
// //             if (err.response.status === 404) {
// //               setError('Bus not found.');
// //               setBusLocation(null);
// //             } else if (err.response.status === 400) {
// //               setError('Bus number is required.');
// //             } else {
// //               setError(`Error: ${err.response.status} - ${err.response.data.msg || 'Server error'}`);
// //             }
// //           } else if (err.request) {
// //             setError('Network error. Please check your internet connection.');
// //           } else {
// //             setError('Failed to make the request. Please try again.');
// //           }
// //         } else {
// //           setError('An unexpected error occurred.');
// //         }
// //         setBusLocation(null);
// //         // Stop the interval on error
// //         stopTracking();
// //       }
// //     };

// //     // Initial fetch
// //     await fetchLocation();
// //     setLoading(false);

// //     // Set up interval for real-time updates (e.g., every 5 seconds)
// //     intervalRef.current = setInterval(fetchLocation, 5000);
// //   };

// //   const stopTracking = () => {
// //     if (intervalRef.current) {
// //       clearInterval(intervalRef.current);
// //       intervalRef.current = null;
// //       setLoading(false);
// //     }
// //   };

// //   // Clean up interval on component unmount
// //   useEffect(() => {
// //     return () => {
// //       if (intervalRef.current) {
// //         clearInterval(intervalRef.current);
// //       }
// //     };
// //   }, []);

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <View style={styles.container}>
// //         <Text style={styles.header}>Bus Location Tracker</Text>
// //         <Text style={styles.subHeader}>
// //           Enter a bus number to track its real-time location.
// //         </Text>

// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Bus Number</Text>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="e.g., TN-37-1234"
// //             value={busNumber}
// //             onChangeText={setBusNumber}
// //           />
// //         </View>

// //         <TouchableOpacity
// //           style={styles.trackButton}
// //           onPress={startTracking}
// //           disabled={loading}
// //         >
// //           {loading ? (
// //             <ActivityIndicator color="#fff" />
// //           ) : (
// //             <Text style={styles.trackButtonText}>Start Tracking</Text>
// //           )}
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.stopButton, !intervalRef.current && styles.disabledButton]}
// //           onPress={stopTracking}
// //           disabled={!intervalRef.current}
// //         >
// //           <Text style={styles.stopButtonText}>Stop Tracking</Text>
// //         </TouchableOpacity>

// //         {error && (
// //           <View style={styles.errorBox}>
// //             <Text style={styles.errorText}>{error}</Text>
// //           </View>
// //         )}

// //         {busLocation && (
// //           <View style={styles.resultBox}>
// //             <Text style={styles.resultTitle}>Bus Location:</Text>
// //             <Text style={styles.resultText}>Bus Number: {busLocation.busNumber}</Text>
// //             <Text style={styles.resultText}>Latitude: {busLocation.lat}</Text>
// //             <Text style={styles.resultText}>Longitude: {busLocation.long}</Text>
// //             <Text style={styles.resultText}>
// //               Updated At: {new Date(busLocation.updatedAt).toLocaleTimeString()}
// //             </Text>
// //           </View>
// //         )}
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     justifyContent: 'center',
// //   },
// //   header: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 5,
// //     textAlign: 'center',
// //   },
// //   subHeader: {
// //     fontSize: 16,
// //     color: '#666',
// //     marginBottom: 30,
// //     textAlign: 'center',
// //   },
// //   inputGroup: {
// //     marginBottom: 15,
// //   },
// //   label: {
// //     fontSize: 14,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   input: {
// //     backgroundColor: '#fff',
// //     height: 50,
// //     paddingHorizontal: 15,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //   },
// //   trackButton: {
// //     backgroundColor: '#2ecc71',
// //     padding: 15,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   trackButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   stopButton: {
// //     backgroundColor: '#e74c3c',
// //     padding: 15,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },
// //   stopButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   disabledButton: {
// //     opacity: 0.5,
// //   },
// //   errorBox: {
// //     backgroundColor: '#e74c3c',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginTop: 20,
// //     alignItems: 'center',
// //   },
// //   errorText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   resultBox: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     marginTop: 20,
// //   },
// //   resultTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#333',
// //   },
// //   resultText: {
// //     fontSize: 16,
// //     color: '#555',
// //     lineHeight: 24,
// //   },
// // });

// // export default BusTracker;




// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useUser } from '../context/userContext';
// // Note: We are no longer using axios for the streaming endpoint.
// // import { useUser } from '../context/UserContext';

// interface BusLocation {
//   busNumber: string;
//   lat: number;
//   long: number;
//   updatedAt: string;
// }

// const BusTracker: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = `http://${ip}:4000/api/buses`;

//   const [busNumber, setBusNumber] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   // Use a ref to store the EventSource instance so it persists across renders
//   const eventSourceRef = useRef<EventSource | null>(null);

//   const startTracking = () => {
//     setError(null);
//     setBusLocation(null);

//     if (!busNumber) {
//       setError('Please enter a bus number.');
//       return;
//     }

//     // Clear any existing connection to prevent multiple trackers
//     stopTracking();

//     setLoading(true);

//     // Create an EventSource connection to the streaming endpoint
//     const url = `${API_BASE_URL}/streamBusLocation?busNumber=${busNumber}`;
//     const newEventSource = new EventSource(url);
//     eventSourceRef.current = newEventSource;

//     newEventSource.onopen = () => {
//         console.log('EventSource connection opened.');
//         setLoading(false);
//     };

//     newEventSource.onmessage = (event) => {
//       try {
//         const data: BusLocation = JSON.parse(event.data);
//         if (data.busNumber) {
//             setBusLocation(data);
//             setError(null);
//         } else {
//              // Handle initial empty data payload
//              setLoading(false);
//         }
//       } catch (e) {
//         console.error('Failed to parse event data:', e);
//         setError('Received malformed data from the server.');
//         setBusLocation(null);
//         stopTracking();
//       }
//     };

//     newEventSource.onerror = (e) => {
//       console.error('EventSource error:', e);
//       setLoading(false);
//       setError('Could not connect to the bus tracking server. Please try again.');
//       setBusLocation(null);
//       stopTracking();
//     };
//   };

//   const stopTracking = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//       setLoading(false);
//       Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
//     }
//   };

//   // Clean up the EventSource connection on component unmount
//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
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

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bus Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., TN-37-1234"
//             value={busNumber}
//             onChangeText={setBusNumber}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={startTracking}
//           disabled={loading || eventSourceRef.current !== null}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.trackButtonText}>Start Tracking</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.stopButton, !eventSourceRef.current && styles.disabledButton]}
//           onPress={stopTracking}
//           disabled={!eventSourceRef.current}
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
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#fff',
//     height: 50,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
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



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   // SafeAreaView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { useUser } from '../context/userContext';

// interface BusLocation {
//   busNumber: string;
//   lat: number;
//   long: number;
//   updatedAt: string;
// }

// const BusTracker: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = `http://${ip}:4000/api/buses`;

//   const [busNumber, setBusNumber] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const startTracking = async () => {
//     setError(null);
//     setBusLocation(null);

//     if (!busNumber) {
//       setError('Please enter a bus number.');
//       return;
//     }

//     setLoading(true);

//     // Clear any existing interval to prevent multiple simultaneous trackers
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     const fetchLocation = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/streamBusLocation`, {
//           params: { busNumber },
//         })

//         if (response.status === 200) {
//           setBusLocation(response.data);
//           setError(null);
//         }
//       } catch (err) {
//         if (axios.isAxiosError(err)) {
//           if (err.response) {
//             if (err.response.status === 404) {
//               setError('Bus not found.');
//               setBusLocation(null);
//             } else if (err.response.status === 400) {
//               setError('Bus number is required.');
//             } else {
//               setError(`Error: ${err.response.status} - ${err.response.data.msg || 'Server error'}`);
//             }
//           } else if (err.request) {
//             setError('Network error. Please check your internet connection.');
//           } else {
//             setError('Failed to make the request. Please try again.');
//           }
//         } else {
//           setError('An unexpected error occurred.');
//         }
//         setBusLocation(null);
//         // Stop the interval on error
//         stopTracking();
//       }
//     };

//     // Initial fetch
//     await fetchLocation();
//     setLoading(false);

//     // Set up interval for real-time updates (e.g., every 5 seconds)
//     intervalRef.current = setInterval(fetchLocation, 5000);
//   };

//   const stopTracking = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//       setLoading(false);
//       Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
//     }
//   };

//   // Clean up interval on component unmount
//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
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

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bus Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., TN-37-1234"
//             value={busNumber}
//             onChangeText={setBusNumber}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={startTracking}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.trackButtonText}>Start Tracking</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.stopButton, !intervalRef.current && styles.disabledButton]}
//           onPress={stopTracking}
//           disabled={!intervalRef.current}
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



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useUser } from '../context/userContext';

// interface BusLocation {
//   busNumber: string;
//   lat: number;
//   long: number;
//   updatedAt: string;
// }

// const BusTracker: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = `http://${ip}:4000/api/buses`;

//   const [busNumber, setBusNumber] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const eventSourceRef = useRef<EventSource | null>(null);

//   const startTracking = () => {
//     setError(null);
//     setBusLocation(null);

//     if (!busNumber) {
//       setError('Please enter a bus number.');
//       return;
//     }

//     // Close any existing connection
//     stopTracking();

//     setLoading(true);

//     try {
//       // Create SSE connection
//       const url = `${API_BASE_URL}/streamBusLocation?busNumber=${encodeURIComponent(busNumber)}`;
//       const eventSource = new EventSource(url);
//       eventSourceRef.current = eventSource;

//       eventSource.onopen = () => {
//         console.log('SSE connection opened');
//         setLoading(false);
//       };

//       eventSource.onmessage = (event) => {
//         try {
//           const data: BusLocation = JSON.parse(event.data);
//           if (data.busNumber) {
//             setBusLocation(data);
//             setError(null);
//           }
//         } catch (e) {
//           console.error('Failed to parse event data:', e);
//           setError('Received malformed data from server');
//         }
//       };

//       eventSource.onerror = (error) => {
//         console.error('SSE error:', error);
//         setLoading(false);
//         setError('Connection error. Please try again.');
//         stopTracking();
//       };
//     } catch (error) {
//       console.error('Failed to create SSE connection:', error);
//       setLoading(false);
//       setError('Failed to start tracking. Please try again.');
//     }
//   };

//   const stopTracking = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//       setLoading(false);
//       Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
//     }
//   };

//   // Clean up on component unmount
//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
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

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bus Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., TN-37-1234"
//             value={busNumber}
//             onChangeText={setBusNumber}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={startTracking}
//           disabled={loading || eventSourceRef.current !== null}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.trackButtonText}>Start Tracking</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.stopButton, !eventSourceRef.current && styles.disabledButton]}
//           onPress={stopTracking}
//           disabled={!eventSourceRef.current}
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

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import EventSource from 'react-native-event-source';
// import { useUser } from '../context/userContext';

// interface BusLocation {
//   busNumber: string;
//   lat: number;
//   long: number;
//   updatedAt: string;
// }

// const BusTracker: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = `http://${ip}:4000/api/buses`;

//   const [busNumber, setBusNumber] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const eventSourceRef = useRef<EventSource | null>(null);

//   const startTracking = () => {
//     setError(null);
//     setBusLocation(null);

//     if (!busNumber) {
//       setError('Please enter a bus number.');
//       return;
//     }

//     // Close any existing connection
//     stopTracking();

//     setLoading(true);

//     try {
//       // Create SSE connection using react-native-event-source
//       const url = `${API_BASE_URL}/streamBusLocation?busNumber=${encodeURIComponent(busNumber)}`;
//       const eventSource = new EventSource(url);
//       eventSourceRef.current = eventSource;

//       eventSource.addEventListener('open', () => {
//         console.log('SSE connection opened');
//         setLoading(false);
//       });

//       eventSource.addEventListener('message', (event: any) => {
//         try {
//           if (event.data) {
//             const data: BusLocation = JSON.parse(event.data);
//             if (data.busNumber) {
//               setBusLocation(data);
//               setError(null);
//             }
//           }
//         } catch (e) {
//           console.error('Failed to parse event data:', e);
//           setError('Received malformed data from server');
//         }
//       });

//       eventSource.addEventListener('error', (error: any) => {
//         console.error('SSE error:', error);
//         setLoading(false);
//         setError('Connection error. Please try again.');
//         stopTracking();
//       });

//     } catch (error) {
//       console.error('Failed to create SSE connection:', error);
//       setLoading(false);
//       setError('Failed to start tracking. Please try again.');
//     }
//   };

//   const stopTracking = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//       setLoading(false);
//       Alert.alert('Tracking Stopped', 'Bus location tracking has been stopped.');
//     }
//   };

//   // Clean up on component unmount
//   useEffect(() => {
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
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

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bus Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., TN-37-1234"
//             value={busNumber}
//             onChangeText={setBusNumber}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={startTracking}
//           disabled={loading || eventSourceRef.current !== null}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.trackButtonText}>Start Tracking</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.stopButton, !eventSourceRef.current && styles.disabledButton]}
//           onPress={stopTracking}
//           disabled={!eventSourceRef.current}
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

// // Keep your existing styles...
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'flex-start',
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
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#fff',
//     height: 50,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
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
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource from 'react-native-event-source';
import { useUser } from '../context/userContext';

interface BusLocation {
  busNumber: string;
  lat: number;
  long: number;
  updatedAt: string;
}

const BusTracker: React.FC = () => {
  const { ip } = useUser();
  const API_BASE_URL = `http://${ip}:4000/api/buses`;

  const [busNumber, setBusNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const eventSourceRef = useRef<EventSource | null>(null);

  const startTracking = async () => {
    setError(null);
    setBusLocation(null);
    setConnectionStatus('Connecting...');

    if (!busNumber) {
      setError('Please enter a bus number.');
      setConnectionStatus('Disconnected');
      return;
    }

    // Close any existing connection
    stopTracking();

    setLoading(true);

    try {
      // First test if the bus exists
      const testResponse = await fetch(
        `${API_BASE_URL}/testBusLocation?busNumber=${encodeURIComponent(busNumber)}`
      );
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        throw new Error(errorData.error || 'Bus not found');
      }

      // Create SSE connection
      const url = `${API_BASE_URL}/streamBusLocation?busNumber=${encodeURIComponent(busNumber)}`;
      console.log('Connecting to SSE:', url);
      
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('open', () => {
        console.log('SSE connection opened successfully');
        setLoading(false);
        setError(null);
        setIsConnected(true);
        setConnectionStatus('Connected');
      });

      eventSource.addEventListener('message', (event: any) => {
        try {
          console.log('SSE Message received:', event.data);
          
          // Skip heartbeat messages
          if (event.data === 'heartbeat' || event.data === ': heartbeat') {
            return;
          }

          if (event.data) {
            const data: BusLocation = JSON.parse(event.data);
            console.log('Parsed bus location:', data);
            
            if (data.busNumber) {
              setBusLocation(data);
              setError(null);
            }
          }
        } catch (e) {
          console.error('Failed to parse SSE data:', e, event.data);
          setError('Invalid data received from server');
        }
      });

      eventSource.addEventListener('error', (event: any) => {
        console.error('SSE Error event:', event);
        setLoading(false);
        setError('Connection error or server unavailable');
        setConnectionStatus('Error');
        stopTracking();
      });

    } catch (error: any) {
      console.error('Failed to start tracking:', error);
      setLoading(false);
      setError(error.message || 'Failed to start tracking');
      setConnectionStatus('Error');
      stopTracking();
    }
  };

  const stopTracking = () => {
    if (eventSourceRef.current) {
      console.log('Closing SSE connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setLoading(false);
      setConnectionStatus('Disconnected');
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bus Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., TN-37-1234"
            value={busNumber}
            onChangeText={setBusNumber}
            editable={!isConnected}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.trackButton, (loading || isConnected) && styles.disabledButton]}
            onPress={startTracking}
            disabled={loading || isConnected}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.trackButtonText}>Start Tracking</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stopButton, !isConnected && styles.disabledButton]}
            onPress={stopTracking}
            disabled={!isConnected}
          >
            <Text style={styles.stopButtonText}>Stop Tracking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: {connectionStatus}</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {busLocation && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Live Bus Location:</Text>
            <Text style={styles.resultText}>Bus Number: {busLocation.busNumber}</Text>
            <Text style={styles.resultText}>Latitude: {busLocation.lat}</Text>
            <Text style={styles.resultText}>Longitude: {busLocation.long}</Text>
            <Text style={styles.resultText}>
              Updated: {new Date(busLocation.updatedAt).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {isConnected && !busLocation && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Connected. Waiting for location updates...</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
});

export default BusTracker;
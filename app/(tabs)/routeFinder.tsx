// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { useUser } from '../context/userContext';
// import { Ionicons } from '@expo/vector-icons';

// interface Coordinates {
//   lat: number;
//   long: number;
// }

// // Updated the Stop interface to include the _id
// interface Stop {
//   _id: string;
//   name: string;
//   coordinates: Coordinates;
// }

// interface ApiResponse {
//   stops?: Stop[];
//   msg?: string;
// }

// const RouteFinder: React.FC = () => {
//   const { ip } = useUser();
//   const API_BASE_URL = `http://${ip}:4000/api/stops`;

//   const [startingLocation, setStartingLocation] = useState<string>('');
//   const [endingLocation, setEndingLocation] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [foundStops, setFoundStops] = useState<Stop[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [suggestedStops, setSuggestedStops] = useState<Stop[]>([]);
//   const [allStops, setAllStops] = useState<Stop[]>([]);
//   const [allStopsLoading, setAllStopsLoading] = useState<boolean>(false);
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
//   const [activeInput, setActiveInput] = useState<'starting' | 'ending' | null>(null);

//   const debounce = (func: Function, delay: number) => {
//     return (...args: any) => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
//       debounceTimeout.current = setTimeout(() => func(...args), delay);
//     };
//   };

//   const fetchSuggestions = async (query: string) => {
//     if (!query) {
//       setSuggestedStops([]);
//       return;
//     }
//     try {
//       const response = await axios.get<ApiResponse>(`${API_BASE_URL}/suggestedStops`, {
//         params: { suggested: query },
//       });
//       if (response.data.stops) {
//         setSuggestedStops(response.data.stops);
//       } else {
//         setSuggestedStops([]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch suggestions:', err);
//       setSuggestedStops([]);
//     }
//   };

//   const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

//   const fetchAllStops = async () => {
//     setAllStopsLoading(true);
//     try {
//       // The backend should return the _id for each stop here
//       const response = await axios.get<ApiResponse>(`${API_BASE_URL}/getAllStops`, {
//         params: { trackBus: 'True' },
//       });
//       if (response.data.stops) {
//         setAllStops(response.data.stops);
//       }
//     } catch (err) {
//       console.error('Failed to fetch all stops:', err);
//     } finally {
//       setAllStopsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllStops();
//   }, []);

//   const handleFindRoute = async () => {
//     setError(null);
//     setFoundStops(null);
//     setLoading(true);
//     setSuggestedStops([]);
//     setActiveInput(null);
//     if (!startingLocation || !endingLocation) {
//       setError('Please enter both a starting and ending location.');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await axios.get<any>(`${API_BASE_URL}/routeFinder`, {
//         params: {
//           startingLocation: startingLocation,
//           endingLocation: endingLocation,
//         },
//       });

//       console.log(response.data);

//       if (response.status == 200 && response.data.route && response.data.route.stopsInBetween) {
//         const foundStopIds = response.data.route.stopsInBetween;
//         // The filter now works correctly because the allStops array contains the _id property
//         const filteredStops = allStops.filter(stop => foundStopIds.includes(stop._id));
//         setFoundStops(filteredStops);
//         console.log(filteredStops)
//       } else {
//         setError('No stops found for this route or an unexpected data format was received.');
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           const contentType = err.response.headers['content-type'];
//           if (contentType && contentType.includes('text/html')) {
//             setError(`Server responded with an HTML error page. Status: ${err.response.status}`);
//           } else {
//             setError(`Error: ${err.response.status} - ${err.response.data.msg || 'Server error'}`);
//           }
//         } else if (err.request) {
//           setError('Network error. Please check your internet connection.');
//         } else {
//           setError('Failed to make the request. Please try again.');
//         }
//       } else {
//         setError('An unexpected error occurred.');
//       }
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuggestionPress = (stopName: string) => {
//     if (activeInput === 'starting') {
//       setStartingLocation(stopName);
//     } else if (activeInput === 'ending') {
//       setEndingLocation(stopName);
//     }
//     setSuggestedStops([]);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.header}>Find Stops Between Two Points</Text>

//         <View style={styles.inputGroup}>
//           <TextInput
//             style={styles.input}
//             placeholder="Starting Location"
//             value={startingLocation}
//             onChangeText={(text) => {
//               setStartingLocation(text);
//               setActiveInput('starting');
//               debouncedFetchSuggestions(text);
//             }}
//           />
//         </View>

//         {suggestedStops.length > 0 && (
//           <View style={styles.suggestionsContainer}>
//             <Text style={styles.suggestionsTitle}>Suggested Stops:</Text>
//             <ScrollView style={styles.suggestionsList}>
//               {suggestedStops.map((stop, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.suggestionItem}
//                   onPress={() => handleSuggestionPress(stop.name)}
//                 >
//                   <Ionicons name="location-outline" size={20} color="#3498db" />
//                   <Text style={styles.suggestionText}>{stop.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <View style={styles.inputGroup}>
//           <TextInput
//             style={styles.input}
//             placeholder="Ending Location"
//             value={endingLocation}
//             onChangeText={(text) => {
//               setEndingLocation(text);
//               setActiveInput('ending');
//               debouncedFetchSuggestions(text);
//             }}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.findButton}
//           onPress={handleFindRoute}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.findButtonText}>Find Route</Text>
//           )}
//         </TouchableOpacity>

//         {error && (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}
//         {foundStops && foundStops.length > 0 && (
//           <View style={styles.resultBox}>
//             <Text style={styles.resultTitle}>Stops Found</Text>
//             <ScrollView style={styles.stopsList}>
//               {foundStops.map((stop, index) => (
//                 <View key={index} style={styles.stopItem}>
//                   <Text style={styles.stopName}>{stop.name}</Text>
//                   <Text style={styles.stopCoords}>
//                     Lat: {stop.coordinates.lat}, Long: {stop.coordinates.long}
//                   </Text>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//         <View style={styles.allStopsContainer}>
//           <Text style={styles.allStopsTitle}>All Available Stops</Text>
//           {allStopsLoading ? (
//             <ActivityIndicator color="#333" />
//           ) : (
//             <ScrollView style={styles.allStopsList}>
//               {allStops.slice(0, 10).map((stop, index) => (
//                 <View key={index} style={styles.allStopsItem}>
//                   <Text style={styles.stopName}>{stop.name}</Text>
//                 </View>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 50,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subHeader: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 10,
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
//   findButton: {
//     backgroundColor: '#3498db',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   findButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   stopsList: {
//     maxHeight: 200,
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   stopItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   stopName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   stopCoords: {
//     fontSize: 14,
//     color: '#666',
//   },
//   suggestionsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 10,
//     padding: 10,
//   },
//   suggestionsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#555',
//     marginBottom: 5,
//   },
//   suggestionsList: {
//     maxHeight: 150,
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#333',
//   },
//   allStopsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     marginTop: 5,
//     borderColor: '#ddd',
//     marginBottom: 5,
//     padding: 10,
//   },
//   allStopsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#555',
//     marginBottom: 5,
//   },
//   allStopsList: {
//     maxHeight: 150,
//   },
//   allStopsItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
// });

// export default RouteFinder;


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useUser } from '../context/userContext';
import { Ionicons } from '@expo/vector-icons';

interface Coordinates {
  lat: number;
  long: number;
}

// Updated the Stop interface to include the _id
interface Stop {
  _id: string;
  name: string;
  coordinates: Coordinates;
}

interface ApiResponse {
  stops?: Stop[];
  msg?: string;
}

const RouteFinder: React.FC = () => {
  const { ip } = useUser();
  const API_BASE_URL = `http://${ip}:4000/api/stops`;

  const [startingLocation, setStartingLocation] = useState<string>('');
  const [endingLocation, setEndingLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foundStops, setFoundStops] = useState<Stop[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestedStops, setSuggestedStops] = useState<Stop[]>([]);
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [allStopsLoading, setAllStopsLoading] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [activeInput, setActiveInput] = useState<'starting' | 'ending' | null>(null);

  const debounce = (func: Function, delay: number) => {
    return (...args: any) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestedStops([]);
      return;
    }
    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/suggestedStops`, {
        params: { suggested: query },
      });
      if (response.data.stops) {
        setSuggestedStops(response.data.stops);
      } else {
        setSuggestedStops([]);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setSuggestedStops([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const fetchAllStops = async () => {
    setAllStopsLoading(true);
    try {
      // The backend should return the _id for each stop here
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/getAllStops`, {
        params: { trackBus: 'True' },
      });
      if (response.data.stops) {
        setAllStops(response.data.stops);
      }
    } catch (err) {
      console.error('Failed to fetch all stops:', err);
    } finally {
      setAllStopsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStops();
  }, []);

  const handleFindRoute = async () => {
    setError(null);
    setFoundStops(null);
    setLoading(true);
    setSuggestedStops([]);
    setActiveInput(null);
    if (!startingLocation || !endingLocation) {
      setError('Please enter both a starting and ending location.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get<any>(`${API_BASE_URL}/routeFinder`, {
        params: {
          startingLocation: startingLocation,
          endingLocation: endingLocation,
        },
      });

      console.log('Response data from routeFinder:', response.data);
      if (response.status == 200 && response.data.route && response.data.route.stopsInBetween) {
        console.log(response.data.route.stopsInBetween);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const contentType = err.response.headers['content-type'];
          if (contentType && contentType.includes('text/html')) {
            setError(`Server responded with an HTML error page. Status: ${err.response.status}`);
          } else {
            setError(`Error: ${err.response.status} - ${err.response.data.msg || 'Server error'}`);
          }
        } else if (err.request) {
          setError('Network error. Please check your internet connection.');
        } else {
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

  const handleSuggestionPress = (stopName: string) => {
    if (activeInput === 'starting') {
      setStartingLocation(stopName);
    } else if (activeInput === 'ending') {
      setEndingLocation(stopName);
    }
    setSuggestedStops([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Find Stops Between Two Points</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Starting Location"
            value={startingLocation}
            onChangeText={(text) => {
              setStartingLocation(text);
              setActiveInput('starting');
              debouncedFetchSuggestions(text);
            }}
          />
        </View>

        {suggestedStops.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggested Stops:</Text>
            <ScrollView style={styles.suggestionsList}>
              {suggestedStops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(stop.name)}
                >
                  <Ionicons name="location-outline" size={20} color="#3498db" />
                  <Text style={styles.suggestionText}>{stop.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Ending Location"
            value={endingLocation}
            onChangeText={(text) => {
              setEndingLocation(text);
              setActiveInput('ending');
              debouncedFetchSuggestions(text);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.findButton}
          onPress={handleFindRoute}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.findButtonText}>Find Route</Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {foundStops && foundStops.length > 0 && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Stops Found</Text>
            <ScrollView style={styles.stopsList}>
              {foundStops.map((stop, index) => (
                <View key={index} style={styles.stopItem}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopCoords}>
                    Lat: {stop.coordinates.lat}, Long: {stop.coordinates.long}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.allStopsContainer}>
          <Text style={styles.allStopsTitle}>All Available Stops</Text>
          {allStopsLoading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <ScrollView style={styles.allStopsList}>
              {allStops.slice(0, 10).map((stop, index) => (
                <View key={index} style={styles.allStopsItem}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 10,
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
  findButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 2,
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
  stopsList: {
    maxHeight: 200,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  stopItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stopCoords: {
    fontSize: 14,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 10,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  allStopsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 5,
    borderColor: '#ddd',
    marginBottom: 5,
    padding: 10,
  },
  allStopsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  allStopsList: {
    maxHeight: 150,
  },
  allStopsItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default RouteFinder;

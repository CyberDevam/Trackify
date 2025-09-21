import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/userContext';

const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [user, setUser] = useState(null); // Initialize with null
  const router = useRouter();
  const { user,setUser } = useUser();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;


  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <Text style={themeStyles.toggleText}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      {/* Fixed Profile Row */}
      <View style={styles.profileRow}>
        <Image
          source={require("./asset/forgotPassword.png")} // Default image
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.profileInfo}>
          {/* Accessing nested data */}
          <Text style={[styles.username, themeStyles.text]}>{user?.username || "username"}</Text>
          <Text style={[styles.email, themeStyles.text]}>{user?.contacts?.email || "email@example.com"}</Text>
          <TouchableOpacity
            style={[styles.editProfileButton, themeStyles.button]}
          >
            <Text style={themeStyles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Section */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, themeStyles.button]}>
            <Text style={themeStyles.buttonText}>Saved Stops/Routes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, themeStyles.button]}>
            <Text style={themeStyles.buttonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, themeStyles.button]}>
            <Text style={themeStyles.buttonText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, themeStyles.button]}>
            <Text style={themeStyles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {["FAQs", "About us", "Privacy Policies", "Terms & conditions", "Contact us"].map((item) => (
          <TouchableOpacity key={item} style={[styles.singleButton, themeStyles.button]}>
            <Text style={themeStyles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            setUser(null); // Clear user data on logout
            router.push('/login');
          }}
          style={[styles.logoutButton, isDarkMode ? darkStyles.logoutButton : lightStyles.logoutButton]}
        >
          <Text style={themeStyles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },

  // Profile Row
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  avatar: { width: 160, height: 160, borderRadius: 40, marginRight: 12 },
  profileInfo: { flex: 1 },
  username: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, marginBottom: 6 },
  editProfileButton: { padding: 8, borderRadius: 12, borderWidth: 1, alignSelf: 'flex-start' },

  // Scroll section
  scrollContainer: { flex: 1 },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  button: { flex: 1, margin: 4, padding: 12, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  singleButton: { padding: 12, borderRadius: 18, borderWidth: 1, marginVertical: 4, alignItems: 'center' },
  logoutButton: { marginTop: 28, padding: 12, borderRadius: 6, borderWidth: 1, alignItems: 'center', borderStyle: 'solid' },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  text: { color: '#222' },
  button: { borderColor: '#222', backgroundColor: '#fff' },
  buttonText: { color: '#222' },
  logoutButton: { borderColor: '#d46a6a', backgroundColor: '#fff' },
  logoutText: { color: '#d46a6a', fontSize: 16 },
  toggleText: { color: '#222', marginRight: 8 },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#181818' },
  text: { color: '#f9f9f9' },
  button: { borderColor: '#f9f9f9', backgroundColor: '#222' },
  buttonText: { color: '#f9f9f9' },
  logoutButton: { borderColor: '#d46a6a', backgroundColor: '#222' },
  logoutText: { color: '#d46a6a', fontSize: 16 },
  toggleText: { color: '#f9f9f9', marginRight: 8 },
});

export default ProfileScreen;

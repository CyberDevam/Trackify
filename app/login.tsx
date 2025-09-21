




import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // install: expo install @expo/vector-icons
import { useRouter } from 'expo-router';
import { Link } from "expo-router";
import axios from "axios";
import { useUser } from "./context/userContext";
const Login = () => {
  const [NumberOrEmail, setNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, ip } = useUser();
  const handleLogin = async () => {
    if (!NumberOrEmail || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // IMPORTANT: When using Expo Go, you must use the IP address of the machine running the server.
      // Replace this with your machine's IP address.
      const response = await axios.post(`http://${ip}:4000/api/auth/login`, {
        username: NumberOrEmail,
        password: password,
      });
      

      Alert.alert("Success", `Welcome ${response.data.user.username}`);
      // Navigate to another screen or perform other actions
      // Example navigation
      setUser(response.data.user); // Update user context with logged-in user data
      router.push('/profile');
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert("Login Failed", error.response?.data?.msg || "Something went wrong");
    }
  };
  return (
    <View style={styles.container}>
      {/* Top illustration */}
      <Image
        source={require("../assets/images/haha.png")} // Replace with your image
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <Text style={styles.subtitle}>
        Don't Have a Account?{" "}
        <Text style={styles.link}>
          <Link href="/create">Create Account</Link>
        </Text>
      </Text>

      {/* Username field */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-circle-outline" size={22} color="#555" />
        <TextInput
          placeholder="User name/ email"
          placeholderTextColor="#888"
          style={styles.input}
          value={NumberOrEmail}
          onChangeText={setNumberOrEmail}
        />
      </View>

      {/* Password field */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color="#555" />
        <TextInput
          placeholder="User password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot Password link */}
      <View style={styles.ForgotPassword}>
        <Link href="/forgotPassword">
          <Text style={[styles.link, { fontSize: 13 }]}>Forgot Password?</Text>
        </Link>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Decorative circles */}
      <View style={styles.bottomLeftCircle} />
      <View style={styles.bottomRightCircle} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    // paddingTop: 60,
  },
  illustration: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 15,
  },
  link: {
    fontWeight: "bold",
    color: "#111827",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
  },
  button: {
    backgroundColor: "#334155",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  bottomLeftCircle: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1e3a47",
  },
  bottomRightCircle: {
    position: "absolute",
    bottom: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1e3a47",
  },
  ForgotPassword: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  }
});

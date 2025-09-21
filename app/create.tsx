// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // install: expo install @expo/vector-icons
// import { Link } from "expo-router";

// const CreateAccount = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = () => {
//     console.log("Username:", username);
//     console.log("Email:", email);
//     console.log("Password:", password);
//     // Add API call or navigation here
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top illustration */}
//       <Image
//         source={require("../assets/images/YUYU.png")} // Replace with your image
//         style={styles.illustration}
//         resizeMode="contain"
//       />

//       {/* Title */}
//       <Text style={styles.title}>Create New Account</Text>
//       <Text style={styles.subtitle}>
//         Already registered? <Text style={styles.link}><Link href="/login">Login</Link></Text>
//       </Text>

//       {/* Username field */}
//       <View style={styles.inputContainer}>
//         <Ionicons name="person-circle-outline" size={22} color="#555" />
//         <TextInput
//           placeholder="User name/id"
//           placeholderTextColor="#888"
//           style={styles.input}
//           value={username}
//           onChangeText={setUsername}
//         />
//       </View>

//       {/* Email field */}
//       <View style={styles.inputContainer}>
//         <Ionicons name="mail-outline" size={22} color="#555" />
//         <TextInput
//           placeholder="User email"
//           placeholderTextColor="#888"
//           style={styles.input}
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       {/* Password field */}
//       <View style={styles.inputContainer}>
//         <Ionicons name="lock-closed-outline" size={22} color="#555" />
//         <TextInput
//           placeholder="**********"
//           placeholderTextColor="#888"
//           style={styles.input}
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
//       </View>

//       {/* Signup Button */}
//       <TouchableOpacity style={styles.button} onPress={handleSignup}>
//         <Text style={styles.buttonText}>SIGN UP</Text>
//       </TouchableOpacity>

//       {/* Decorative circles */}
//       <View style={styles.bottomLeftCircle} />
//       <View style={styles.bottomRightCircle} />
//     </View>
//   );
// };

// export default CreateAccount;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f8fa",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     padding: 20,
//   },
//   illustration: {
//     width: 250,
//     height: 200,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1f2937",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#4b5563",
//     marginBottom: 13,
//     textAlign: "center",
//   },
//   link: {
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 25,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 15,
//     width: "100%",
//     backgroundColor: "#fff",
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#111",
//   },
//   button: {
//     backgroundColor: "#334155",
//     paddingVertical: 14,
//     paddingHorizontal: 50,
//     borderRadius: 25,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   bottomLeftCircle: {
//     position: "absolute",
//     bottom: -40,
//     left: -40,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#1e3a47",
//   },
//   bottomRightCircle: {
//     position: "absolute",
//     bottom: -40,
//     right: -40,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#1e3a47",
//   },
// });




import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import axios from "axios";
import { useRouter } from "expo-router";
import { useUser } from "./context/userContext";
const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const router = useRouter();
  const { ip } = useUser();
  const handleSignup = async () => {
    if (!username || !password || !email || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const userData = {
      username,
      password,
      contacts: {
        email,
        phone,
      },
      role: "user",
    };

    try {
      const response = await axios.post(`http://${ip}:4000/api/auth/register`, userData);

      // console.log("Signup Success:", response.data);
      Alert.alert("Success", "Account created successfully!");

      // Optional: Navigate to login screen after success
      // navigation.navigate("Login");
      router.replace("/login");
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data || error.message);
      Alert.alert("Signup Failed", error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top illustration */}
      <Image
        source={require("../assets/images/YUYU.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Create New Account</Text>
      <Text style={styles.subtitle}>
        Already registered?{" "}
        <Text style={styles.link}>
          <Link href="/login">Login</Link>
        </Text>
      </Text>

      {/* Username */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-circle-outline" size={22} color="#555" />
        <TextInput
          placeholder="User name/id"
          placeholderTextColor="#888"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={22} color="#555" />
        <TextInput
          placeholder="**********"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={22} color="#555" />
        <TextInput
          placeholder="User email"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={22} color="#555" />
        <TextInput
          placeholder="Phone number"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>


      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Decorative Circles */}
      <View style={styles.bottomLeftCircle} />
      <View style={styles.bottomRightCircle} />
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 60,
  },
  illustration: {
    width: 160,
    height: 160,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    fontWeight: "600",
    color: "#111827",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    color: "#111",
  },
  button: {
    backgroundColor: "#334155",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    // marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  bottomLeftCircle: {
    position: "absolute",
    bottom: -70,
    left: -70,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#1e3a47",
  },
  bottomRightCircle: {
    position: "absolute",
    bottom: -70,
    right: -70,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#1e3a47",
  },
});

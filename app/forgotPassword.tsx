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

// const ForgotPassword = () => {
//   const [changePassword, setChangePassword] = useState("");
//   const [reEnterPassword, setreEnterPassword] = useState("");
//   const handleSend = () => {
//     console.log("Password reset request for:", changePassword);
//     // Add API call here to send reset link
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top illustration */}
//       <Image
//         source={require("../assets/images/Forgot password-bro.png")} // Replace with your image
//         style={styles.illustration}
//         resizeMode="contain"
//       />

//       {/* Title */}
//       <Text style={styles.title}>Forgot Password</Text>
//       <Text style={styles.subtitle}>New Password</Text>

//       {/* Email field */}
//       <View style={styles.inputContainer}>
//         <Ionicons name="mail-outline" size={22} color="#555" />
//         <TextInput
//           placeholder="Change Password"
//           placeholderTextColor="#888"
//           style={styles.input}
//           keyboardType="email-address"
//           value={changePassword}
//           onChangeText={setChangePassword}
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Ionicons name="mail-outline" size={22} color="#555" />
//         <TextInput
//           placeholder="Re-enter Password"
//           placeholderTextColor="#888"
//           style={styles.input}
//           keyboardType="email-address"
//           value={reEnterPassword}
//           onChangeText={setreEnterPassword}
//         />
//       </View>

//       {/* Send Button */}
//       <TouchableOpacity style={styles.button} onPress={handleSend}>
//         <Text style={styles.buttonText}>SEND</Text>
//       </TouchableOpacity>

//       {/* Decorative circles */}
//       <View style={styles.bottomLeftCircle} />
//       <View style={styles.bottomRightCircle} />
//     </View>
//   );
// };

// export default ForgotPassword;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f8fa",
//     alignItems: "center",
//     justifyContent: "center",
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
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#4b5563",
//     marginBottom: 30,
//     textAlign: "center",
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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import axios from "axios";

const ForgotPassword = () => {
  const [username, setUsername] = useState(""); // 👈 needed for backend
  const [changePassword, setChangePassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const router = useRouter();

  const handleSend = async () => {
    if (!username || !changePassword || !reEnterPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (changePassword !== reEnterPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://10.131.78.227:4000/api/auth/forgot-password", {
        username,
        password: changePassword,
      });

      Alert.alert("Success", res.data.msg);

      // ✅ Navigate back to login after success
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Failed", err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./forgotPassword.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your username and new password</Text>

      {/* Username */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={22} color="#555" />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#555" />
        <TextInput
          placeholder="New Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={changePassword}
          onChangeText={setChangePassword}
        />
      </View>

      {/* Re-enter Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#555" />
        <TextInput
          placeholder="Re-enter Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={reEnterPassword}
          onChangeText={setReEnterPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>SEND</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linksContainer}>
        <Text style={styles.linkText}>
          Remember Password?{" "}
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </Text>
      </View>

      <View style={styles.bottomLeftCircle} />
      <View style={styles.bottomRightCircle} />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    padding: 20,
  },
  illustration: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
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
  linksContainer: {
    // marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 5,
  },
  link: {
    fontWeight: "bold",
    color: "#111827",
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
});

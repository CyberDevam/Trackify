import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { UserProvider } from "./context/userContext";

export default function RootLayout() {

  return (
    <UserProvider>
      <Stack>
        {/* Onboarding (Carousel) */}
        <Stack.Screen
          name="index"
          options={{
            title: "Welcome",
            headerStyle: {
              backgroundColor: "#334155",
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerBackTitle: "",
            headerShown: false, // ✅ Full screen for onboarding
          }}
        />

        {/* Login */}
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerStyle: {
              backgroundColor: "#334155",
            },
            headerShown: false,
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerBackTitle: "",
          }}
        />

        {/* Create Account */}
        <Stack.Screen
          name="create"
          options={{
            title: "Create Account",
            headerStyle: {
              backgroundColor: "#334155",
            },
            headerShown: false,
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerBackTitle: "",
          }}
        />

        {/* Forgot Password */}
        <Stack.Screen
          name="forgotPassword"
          options={{
            title: "Reset Password",
            headerStyle: {
              backgroundColor: "#334155",
            },
            headerShown: false,
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerBackTitle: "",
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false, // ✅ Hide header for tab navigation
          }}
        />
      </Stack>
    </UserProvider>
  );
}
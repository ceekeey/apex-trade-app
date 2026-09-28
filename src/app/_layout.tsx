import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* Change to "dark" if you want dark icons, or keep "light" for white icons */}
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#0F172A",
            },
          }}
        />
      </SafeAreaProvider>
      {/* Render the Toast component last */}
      <Toast />
    </AuthProvider>
  );
}
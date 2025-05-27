import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LoginContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login() {
  const {setUser} = useContext(LoginContext)
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://192.168.101.7:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Server response:", data);  // Debug log

      await AsyncStorage.setItem("data", JSON.stringify(data));
      setUser(data);

      const getStoredData = async () => {
        try {
          const stored = await AsyncStorage.getItem("data");
          if (stored) {
            const parsedData = JSON.parse(stored);
            console.log("Fetched from AsyncStorage:", parsedData);
            return parsedData;
          }
        } catch (err) {
          console.error("Error retrieving data:", err);
        }
      };
      await getStoredData();

      if (data.role === "branchManager" || data.role === "admin" || data.role === "user" || data.role === "delivery_agent") {
        console.log("Role verified:", data.role);  // Debug log
        router.replace("/(tabs)/home");
        Alert.alert("Success", `Logged in successfully as ${data.role}`);
      } else {
        Alert.alert("Error", `Invalid role: ${data.role}`);
      }
    } catch (err) {
      console.error("Login error:", err);  // Debug log
      if (!window.navigator.onLine) {
        Alert.alert("Error", "No internet connection. Please check your network.");
      } else {
        Alert.alert("Error", "Unable to connect to server. Please try again later.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange("password", val)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.footerText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#66bb6a",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
});

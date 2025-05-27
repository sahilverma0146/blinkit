// app/signup.jsx
import React, { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "@/context/authContext";
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
export default function Signup() {
  const {setUser} = useContext(LoginContext)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    Location:"",
    pincodes:""
  });

  const router = useRouter();
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
  const { name, email, phone, password , Location , pincodes } = form;

  if (!name || !email || !phone || !password || !Location || !pincodes) {
    Alert.alert("Error", "All fields are required!");
    return;
  }

  if (phone.length !== 10) {
    Alert.alert("Error", "Enter a valid 10-digit phone number.");
    return;
  }

  if (!email.includes("@")) {
    Alert.alert("Error", "Invalid email address.");
    return;
  }

  try {
    const result = await fetch("http://192.168.101.7:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, password , Location , pincodes }),
    });

    const data = await result.json();

    if (data.success) {
      // Store user in AsyncStorage
      await AsyncStorage.setItem("data", JSON.stringify(data));
      setUser(data);
      console.log("data set Successfully")


      const getStoredData = async () => {
        try {
          const stored = await AsyncStorage.getItem("data");
          if (stored) {
            const parsedData = JSON.parse(stored);
            console.log("Fetched from AsyncStorage i am at lofin:", parsedData);
            return parsedData;
            
          }
        } catch (err) {
          console.error("Error retrieving data:", err);
        }
      };
      getStoredData();

      Alert.alert("Success", "Account created successfully!");
      router.push("/(auth)/login");
      

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        Location:"",
        pincodes:""
      });
    } else {
      Alert.alert("Registration Failed", data.message || "Something went wrong.");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to connect to server.");
    console.error("Registration error:", error);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create your account</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={form.name}
          onChangeText={(val) => handleChange("name", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit phone"
          keyboardType="number-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={(val) => handleChange("phone", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange("password", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Location"
          secureTextEntry
          value={form.Location}
          onChangeText={(val) => handleChange("Location", val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Location"
          secureTextEntry
          value={form.pincodes}
          onChangeText={(val) => handleChange("pincodes", val)}
        />
      </View>

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>

      <Text>
        {" "}
        Have a Account{" "}
        <TouchableOpacity onPress={() => router.push("login")}>
          <Text>Login</Text>
        </TouchableOpacity>
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  terms: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
});

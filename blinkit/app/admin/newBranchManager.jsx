import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BranchManagerCreateScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [pincodes, setPincodes] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = async () => {
    if (!name || !location || !phone || !pincodes || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const pincodesArray = pincodes.split(",").map((pin) => pin.trim());

    try {
      const result = await fetch(
        "http://192.168.101.7:5000/api/BranchManager",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            location,
            phone,
            pincodes: pincodesArray,
            email,
            password,
            role: "branchManager"
          }),
        }
      );

      const managerData = await result.json();

      if (managerData.success) {
        await AsyncStorage.setItem(
          "managerDetails",
          JSON.stringify(managerData)
        );
        Alert.alert("Success", "Branch Manager created successfully!");

        const getManagerDetails = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem("managerDetails");
            if (jsonValue !== null) {
              const managerDetails = JSON.parse(jsonValue);
              console.log("Branch Manager Details:", managerDetails);
              return managerDetails;
            } else {
              console.log("No manager details found.");
              return null;
            }
          } catch (error) {
            console.error(
              "Error reading managerDetails from AsyncStorage:",
              error
            );
            return null;
          }
        };
        getManagerDetails();
        // Reset form
        setName("");
        setLocation("");
        setPhone("");
        setPincodes("");
        setemail("");
        setpassword("")
      } else {
        Alert.alert(
          "Registration Failed",
          managerData.message || "Something went wrong."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server.");
      console.error("Registration error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Branch Manager</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Pincodes (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 123456, 654321"
        value={pincodes}
        onChangeText={setPincodes}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setemail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setpassword}
        secureTextEntry
      />

      <Button title="Create Branch Manager" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateDeliveryAgent() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      isActive: true,
    },
  });

  const [user, setUser] = useState(null);

  const getStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem("data");
      if (stored) {
        const parsedData = JSON.parse(stored);
        setUser(parsedData);
        return parsedData;
      }
    } catch (err) {
      console.error("Error retrieving data:", err);
    }
  };

  useEffect(() => {
    getStoredData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const assignedBranch = user?.user?.id;

      const response = await fetch(
        "http://192.168.101.7:5000/api/CreateDeliveryAgent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            assignedBranch,
            isActive: data.isActive,
            role: "delivery_agent",
            status: "available",
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Delivery Agent created successfully!");
        reset();
      } else {
        Alert.alert("Error", result.message || "Failed to create agent.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error or server issue.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Delivery Agent</Text>

      {[ 
        { name: "name", placeholder: "Full Name" },
        { name: "email", placeholder: "Email", keyboardType: "email-address" },
        {
          name: "phone",
          placeholder: "Phone Number",
          keyboardType: "phone-pad",
        },
        { name: "password", placeholder: "Password", secureTextEntry: true },
      ].map(({ name, placeholder, ...props }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              onChangeText={onChange}
              value={value}
              {...props}
            />
          )}
        />
      ))}

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Active:</Text>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { value, onChange } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#ccc", true: "#28a745" }}
              thumbColor={value ? "#fff" : "#fff"}
            />
          )}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>Create Agent</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

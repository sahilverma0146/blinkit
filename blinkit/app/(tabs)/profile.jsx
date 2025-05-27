import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("data");
        if (jsonValue != null) {
          const user = JSON.parse(jsonValue);
          console.log("User from storage:", user);
          setUser(user)
          // return user;

        } else {
          console.log("No user data found in AsyncStorage.");
          return null;
        }
      } catch (e) {
        console.error("Error reading user data from AsyncStorage", e);
        return null;
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/login"); // Update path to match your route
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#66bb6a" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{user.user.name || "No Name"}</Text>
          <Text style={styles.info}>{user.user.phone || "No Phone"}</Text>
          <Text style={styles.info}>{user.user.email}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => router.push("/allOrder")}>
          <Text style={styles.optionText}>Go to Order Summary</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <ProfileOption icon="settings" text="Settings" />
        <TouchableOpacity onPress={handleLogout} style={styles.option}>
          <MaterialIcons name="logout" size={22} color="#f4511e" />
          <Text style={[styles.optionText, { color: "#f4511e" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ProfileOption({ icon, text }) {
  const iconMap = {
    "shopping-bag": <Entypo name="shopping-bag" size={22} color="#333" />,
    "location-pin": <Entypo name="location-pin" size={22} color="#333" />,
    "credit-card": <FontAwesome name="credit-card" size={22} color="#333" />,
    "support-agent": (
      <MaterialIcons name="support-agent" size={22} color="#333" />
    ),
    settings: <MaterialIcons name="settings" size={22} color="#333" />,
  };

  return (
    <TouchableOpacity style={styles.option}>
      {iconMap[icon]}
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  info: {
    color: "#777",
    marginTop: 2,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
});

import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { CartContext } from "@/context/cartContext";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderAgain = () => {
  const { cartItems } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 499 ? 0 : 40; // Free delivery for orders > ₹499
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    try {
      // fetch user which is login
      const userData = await AsyncStorage.getItem("data");
      const data = JSON.parse(userData);

      if (!data || !data.user) {
        return Alert.alert("Error", "User not found. Please log in again.");
      }

      const user = data.user;

      if (!user.pincodes[0]) {
        return Alert.alert("Error", "User pincode not found. Please update your profile.");
      }

      const response = await fetch("http://192.168.101.7:5000/api/placeorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user, 
          cartItems, 
          total,
          userPincode: user.pincodes[0]
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        Alert.alert("Success", "Order placed successfully!");
        // clearCart();
      } else {
        Alert.alert("Failed", responseData.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to place order.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQty}>x{item.quantity}</Text>
      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items in cart</Text>}
      />

      {cartItems.length > 0 && (
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Delivery Charges</Text>
            <Text style={styles.value}>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OrderAgain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: { fontSize: 16, flex: 2 },
  itemQty: { fontSize: 16, flex: 1, textAlign: "center" },
  itemPrice: { fontSize: 16, flex: 1, textAlign: "right" },

  summaryBox: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 16, color: "#333" },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold" },

  placeOrderBtn: {
    backgroundColor: "#0f9d58",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
    color: "#888",
  },
});

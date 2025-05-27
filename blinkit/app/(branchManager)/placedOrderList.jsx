import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";

const previousOrders = [
  {
    id: "order1",
    date: "2025-05-15",
    items: [
      { name: "Tomatoes", qty: 1, price: 42 },
      { name: "Milk", qty: 2, price: 60 },
    ],
    total: 162,
  },
  {
    id: "order2",
    date: "2025-05-13",
    items: [
      { name: "Bread", qty: 2, price: 35 },
      { name: "Eggs", qty: 1, price: 75 },
    ],
    total: 145,
  },{
    id: "order2",
    date: "2025-05-13",
    items: [
      { name: "Bread", qty: 2, price: 35 },
      { name: "Eggs", qty: 1, price: 75 },
    ],
    total: 145,
  },{
    id: "order2",
    date: "2025-05-13",
    items: [
      { name: "Bread", qty: 2, price: 35 },
      { name: "Eggs", qty: 1, price: 75 },
    ],
    total: 145,
  },{
    id: "order2",
    date: "2025-05-13",
    items: [
      { name: "Bread", qty: 2, price: 35 },
      { name: "Eggs", qty: 1, price: 75 },
    ],
    total: 145,
  },
];

export default function PastOrders() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Previous Orders</Text>
      {previousOrders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.date}>🗓 {order.date}</Text>
          <FlatList
            data={order.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>{item.qty} x {item.name}</Text>
                <Text style={styles.itemText}>₹{item.qty * item.price}</Text>
              </View>
            )}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>₹{order.total}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ProductContext } from "@/context/productContext";
import { CartContext } from "@/context/cartContext";

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();
  const { Product } = useContext(ProductContext); // ✅ Destructure the array
  const { addToCart } = useContext(CartContext);
  if (!Product) {
    return <Text>Loading products...</Text>;
  }

  const categoryProducts = Product.filter(
    (product) => product.category.toLowerCase() === id.toLowerCase()
  );
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>addToCart(item)}>
        <Text style={styles.buttonText} >Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{id} Products</Text>
      {categoryProducts.length === 0 ? (
        <Text style={styles.emptyText}>
          No products found in this category.
        </Text>
      ) : (
        <FlatList
          data={categoryProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  image: { width: "100%", height: 140, borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "#444", marginBottom: 8 },
  button: {
    backgroundColor: "#f4511e",
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});

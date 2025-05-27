import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { ProductContext } from "@/context/productContext";

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();
  const { Product } = useContext(ProductContext); // ✅ Destructure the array
  const router = useRouter();
  const filteredProduct = Product.filter((item) => item.id === id);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => router.push(`/admin/edit/${item.id}`)}>
          Edit Product
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Products</Text>

      <FlatList
        data={filteredProduct}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
    backgroundColor: "#0f9d58",
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});

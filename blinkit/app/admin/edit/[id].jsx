import { ProductContext } from "@/context/productContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProduct() {
  const {deleteProduct} = useContext(ProductContext)
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { Product, updateProduct } = useContext(ProductContext);

  const product = Product.find((item) => item.id === id);

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price.toString() || "");

  const handleSave = () => {
    const updated = { ...product, name, price: parseFloat(price) };
    updateProduct(updated);
    router.back(); // go back to previous screen
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deletebutton} onPress={handleSave}>
        <Text style={styles.buttonText} onPress={()=>deleteProduct(product)}>Delete product</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0f9d58",
    padding: 14,
    borderRadius: 8,
  },

  deletebutton: {
    marginTop:10,
    backgroundColor: "#0f9d58",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

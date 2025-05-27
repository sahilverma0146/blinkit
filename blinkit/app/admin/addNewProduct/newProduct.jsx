import { ProductContext } from "@/context/productContext";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddProduct() {
  const { addNewProduct } = useContext(ProductContext);
  const router = useRouter();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [inStock, setInStock] = useState(true);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = () => {
    if (!id || !name || !price || !oldPrice || !weight || !category) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newProduct = {
      id,
      name,
      price: Number(price),
      oldPrice: Number(oldPrice),
      weight,
      inStock,
      category,
      image: image || "https://via.placeholder.com/150",
    };

    addNewProduct(newProduct);
    Alert.alert("Success", "Product added successfully!");
    router.back(); // navigate back
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      <TextInput style={styles.input} placeholder="ID" value={id} onChangeText={setId} />
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Old Price" keyboardType="numeric" value={oldPrice} onChangeText={setOldPrice} />
      <TextInput style={styles.input} placeholder="Weight (e.g. 500g)" value={weight} onChangeText={setWeight} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Image URL (optional)" value={image} onChangeText={setImage} />

      <View style={styles.switchRow}>
        <Text style={styles.label}>In Stock:</Text>
        <Switch value={inStock} onValueChange={setInStock} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0f9d58",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

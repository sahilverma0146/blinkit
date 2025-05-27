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
  // const { addNewProduct } = useContext(ProductContext);
  const router = useRouter();

  const [branchId, setBranchId] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [inStock, setInStock] = useState(true);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {
    // Validate required fields
    if (
      !branchId ||
      !id ||
      !name ||
      !price ||
      !oldPrice ||
      !weight ||
      !category
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Validate numeric fields
    if (isNaN(parseFloat(price)) || isNaN(parseFloat(oldPrice))) {
      Alert.alert("Error", "Price and Old Price must be valid numbers");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        branchPincode: branchId,
        id: id,
        name: name,
        price: price,
        oldPrice: oldPrice,
        weight: weight,
        category: category,
        inStock,
        quantity:quantity,
      };

      const response = await fetch("http://192.168.101.7:5000/api/newProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("Success", "Product added successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Clear form
              setBranchId("");
              setId("");
              setName("");
              setPrice("");
              setOldPrice("");
              setWeight("");
              setCategory("");
              setImage("");
              setInStock("");
              // Optionally navigate back
              // router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to add product");
      }
    } catch (err) {
      Alert.alert("Error", "Network error. Please check your connection.");
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Branch ID"
        value={branchId}
        onChangeText={setBranchId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Old Price"
        keyboardType="decimal-pad"
        value={oldPrice}
        onChangeText={setOldPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (e.g. 500g)"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="quantity"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>In Stock:</Text>
        <Switch value={inStock} onValueChange={setInStock} />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding Product..." : "Add Product"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
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
    color: "#333",
  },
  button: {
    backgroundColor: "#0f9d58",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

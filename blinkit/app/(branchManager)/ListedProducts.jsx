import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "@/context/authContext";
import { useContext } from "react";

export default function BranchProducts() {
  const { user } = useContext(LoginContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      console.log("Starting fetchProducts...");
      
      // Try to get user data from context first, then AsyncStorage
      let userData = user;
      // if (!userData) {
      //   const storedData = await AsyncStorage.getItem("data");
      //   userData = storedData ? JSON.parse(storedData) : null;
      //   console.log("User data from AsyncStorage:", userData);
      // } else {
      //   console.log("User data from context:", userData);
      // }

      if (!userData ) {
        console.log("No user data found");
        Alert.alert("Error", "Please login again");
        return;
      }

      // const pincode = userData.user.pincode;
      // console.log("Using pincode:", pincode);

      // const pincode = "123456";
      const pincode = user.pincodes;

      if (!pincode) {
        console.log("No pincode found in user data");
        Alert.alert("Error", "User pincode not found");
        return;
      }

      console.log("Making API request to list products...");
      const response = await fetch("http://192.168.101.7:5000/api/listProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pincode }),
      });

      const data = await response.json();
      console.log(data,"sdskjdkjdsj")
      

      

      if (!data.success) {
        console.log("API returned success: false", data);
        Alert.alert("Error", data.message || "Failed to load products");
        return;
      }

      console.log("Products received:", data.products);
      console.log("Number of products:", data.products?.length || 0);

      const productList = data.products || [];
      setProducts(productList);
      setFilteredProducts(productList);
      
      if (productList.length === 0) {
        console.log("No products found for this branch");
      }
      
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      Alert.alert("Error", `Network error: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Filtered products:", filtered.length);
      setFilteredProducts(filtered);
    }
  };

  const onRefresh = () => {
    console.log("Refreshing products...");
    setRefreshing(true);
    fetchProducts();
  };

  useEffect(() => {
    console.log("Component mounted, fetching products...");
    console.log("User from context:", user);
    fetchProducts();
  }, []);

  // Debug: Log current state
  useEffect(() => {
    console.log("Current state - Products:", products.length, "Filtered:", filteredProducts.length, "Loading:", loading);
  }, [products, filteredProducts, loading]);

  const ProductCard = ({ item }) => {
    console.log("Rendering product:", item.name);
    return (
      <View style={styles.productCard}>
        <TouchableOpacity style={styles.cardContent}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage}
              onError={(error) => console.log("Image load error:", error.nativeEvent.error)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {item.name || "Unnamed Product"}
            </Text>
            
            <Text style={styles.categoryText}>
              {item.category || "General"}
            </Text>

            <Text style={styles.price}>
              ₹{parseFloat(item.price || 0).toFixed(2)}
            </Text>

            <Text style={styles.stockText}>
              Stock: {item.stock || 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Branch Products</Text>
        <Text style={styles.headerSubtitle}>
          {filteredProducts.length} products
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Debug Info - Remove this in production */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Debug: {products.length} total, {filteredProducts.length} filtered, Loading: {loading.toString()}
        </Text>
      </View>

      {/* Products List */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => <ProductCard item={item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4f46e5"]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {loading ? "Loading..." : "No products found for this branch"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ddd',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugContainer: {
    backgroundColor: '#fff3cd',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 5,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
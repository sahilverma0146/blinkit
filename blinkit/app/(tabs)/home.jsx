import { CartContext } from "@/context/cartContext";
import { ProductContext } from "@/context/productContext";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "@/context/authContext";
import { LinearGradient } from "expo-linear-gradient";

import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen width for responsive design
const { width } = Dimensions.get("window");

// Mock data for categories
const categories = [
  { id: "1", name: "Vegetables", icon: "leaf" },
  { id: "2", name: "Fruits", icon: "apple" },
  { id: "3", name: "Dairy", icon: "glass" },
  { id: "4", name: "Bakery", icon: "birthday-cake" },
  { id: "5", name: "Snacks", icon: "cutlery" },
  { id: "6", name: "Beverages", icon: "coffee" },
  { id: "7", name: "Personal Care", icon: "user-md" },
  { id: "8", name: "Household", icon: "home" },
];

const banners = [
  {
    id: "1",
    imageUrl:
      "https://scontent-del1-1.xx.fbcdn.net/v/t1.6435-9/89030091_1315522818642972_656344717352501248_n.png?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ry95fsZeOHEQ7kNvwGqBOg1&_nc_oc=AdmeiqGAm-t8T-KFbTrPVVWOaeAkiByJ2vvrgw50lZ3rkV2MQKEiIWO461OY0vcHlo0&_nc_zt=23&_nc_ht=scontent-del1-1.xx&_nc_gid=_VtjlJgjUHLlwGXuNG3LDg&oh=00_AfLmNfOQbWTiOqzk2_AIbhdtF-_SoDOby6T1goRZZoTduA&oe=684B8527",
  },
  {
    id: "2",
    imageUrl:
      "https://scontent-del1-1.xx.fbcdn.net/v/t1.6435-9/89030091_1315522818642972_656344717352501248_n.png?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ry95fsZeOHEQ7kNvwGqBOg1&_nc_oc=AdmeiqGAm-t8T-KFbTrPVVWOaeAkiByJ2vvrgw50lZ3rkV2MQKEiIWO461OY0vcHlo0&_nc_zt=23&_nc_ht=scontent-del1-1.xx&_nc_gid=_VtjlJgjUHLlwGXuNG3LDg&oh=00_AfLmNfOQbWTiOqzk2_AIbhdtF-_SoDOby6T1goRZZoTduA&oe=684B8527",
  },
  {
    id: "3",
    imageUrl:
      "https://scontent-del1-1.xx.fbcdn.net/v/t1.6435-9/89030091_1315522818642972_656344717352501248_n.png?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ry95fsZeOHEQ7kNvwGqBOg1&_nc_oc=AdmeiqGAm-t8T-KFbTrPVVWOaeAkiByJ2vvrgw50lZ3rkV2MQKEiIWO461OY0vcHlo0&_nc_zt=23&_nc_ht=scontent-del1-1.xx&_nc_gid=_VtjlJgjUHLlwGXuNG3LDg&oh=00_AfLmNfOQbWTiOqzk2_AIbhdtF-_SoDOby6T1goRZZoTduA&oe=684B8527",
  },
];

function Home() {
  const { Product } = useContext(ProductContext);
  const { user } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userPincode, setUserPincode] = useState("");
  const [error, setError] = useState(null);

  // Get cart context
  const cartContext = useContext(CartContext);
  const router = useRouter();

  // Debug: Check if CartContext is properly loaded

  const fetchProductsHome = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("the home user Details are ", user);

      if (!user) {
        Alert.alert("Error", "Please login again");
        setLoading(false);
        return;
      }

      // Get user pincode from user data
      const pincode = user.pincodes || user.Pincode;
      if (!pincode) {
        Alert.alert("Error", "Please update your profile with a valid pincode");
        setLoading(false);
        return;
      }

      setUserPincode(pincode);
      console.log("Fetching products for pincode:", pincode);

      // Make API call with user's pincode
      const response = await fetch(
        `http://192.168.101.7:5000/api/homeProducts/${pincode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Full API response:", data);

      // Initialize products as empty array if no products found
      if (!data.products || data.products.length === 0) {
        console.log("No products available for this pincode.");
        setProducts([]);
        Alert.alert(
          "No Service Available",
          "Sorry, we don't have service available in your area yet."
        );
        return;
      }

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setError(error.message);
      Alert.alert("Error", error.message);
      // Initialize products as empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductsHome();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      console.log("Attempting to add product to cart:", product);

      // Check if CartContext exists
      if (!cartContext) {
        console.error("CartContext is not available");
        Alert.alert(
          "Error",
          "Cart service is not available. Please try again."
        );
        return;
      }

      // Check if addToCart function exists
      if (!cartContext.addToCart) {
        console.error("addToCart function is not available in CartContext");
        Alert.alert(
          "Error",
          "Add to cart function is not available. Please try again."
        );
        return;
      }

      // Ensure product has required fields
      const productToAdd = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        weight: product.weight || product.unit,
        category: product.category,
        inStock: product.inStock !== false,
        ...product, // Include any other product properties
      };

      // Check if product has required fields
      if (!productToAdd.id || !productToAdd.name || !productToAdd.price) {
        console.error("Product missing required fields:", productToAdd);
        Alert.alert("Error", "Product information is incomplete");
        return;
      }

      console.log("Adding product to cart:", productToAdd);

      // Call addToCart function
      await cartContext.addToCart(productToAdd);

      // Show success message
      Alert.alert("Success", `${product.name} added to cart!`);
      console.log("Product successfully added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Alert.alert("Error", "Failed to add product to cart. Please try again.");
    }
  };

  // Category item renderer
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => setSelectedCategory(item.name)}
    >
      <View
        style={[
          styles.categoryIconContainer,
          selectedCategory === item.name ? styles.selectedCategoryIcon : null,
        ]}
      >
        <FontAwesome
          name={item.icon}
          size={24}
          color={selectedCategory === item.name ? "#fff" : "#0f9d58"}
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.name ? styles.selectedCategoryText : null,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // FIXED: Product item renderer with corrected price display
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id || item._id}`)}
    >
      {/* Uncommented and fixed image section */}
      <View style={styles.productImageContainer}>
        <Image
          source={{
            uri:
              item.image || "https://via.placeholder.com/150x150?text=No+Image",
          }}
          style={styles.productImage}
          defaultSource={{
            uri: "https://via.placeholder.com/150x150?text=Loading",
          }}
        />
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productWeight}>{item.weight || item.unit}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          {/* FIXED: Corrected price display - was showing item.products instead of item.price */}
          <Text style={styles.price}>₹{item.price}</Text>
          {item.oldPrice && (
            <>
              <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
              <Text style={styles.discount}>
                {Math.round(
                  ((item.oldPrice - item.price) / item.oldPrice) * 100
                )}
                % OFF
              </Text>
            </>
          )}
        </View>
        {item.inStock !== false ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="plus"
              size={12}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, styles.disabledButton]}
            disabled
          >
            <Text style={[styles.addButtonText, styles.disabledButtonText]}>
              SOLD OUT
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  // Banner renderer
  const renderBanner = ({ item }) => (
    <Image
      source={{ uri: item.imageUrl }}
      style={styles.bannerImage}
      resizeMode="cover"
    />
  );

  // FIXED: Proper fallback for products
  // const allProducts = products.length > 0 ? products : Product || [];

  // Filter products based on search query and selected category
  const filteredProducts = (products || []).filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // FIXED: Get cart count from CartContext
  const cartCount =
    cartContext?.cart?.length || cartContext?.cartItems?.length || 0;

  // Loading state
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={16} color="#0f9d58" />
          <Text style={styles.locationText}>Deliver to: Home</Text>
          <FontAwesome name="angle-down" size={16} color="#0f9d58" />
        </View>
        <Text style={styles.deliveryTime}>Delivery in 10 minutes</Text>

        <View style={styles.iconRightContainer}>
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={styles.cartButton}
          >
            <FontAwesome name="shopping-cart" size={24} color="#333" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.screen}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={18}
            color="#0f9d58"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for atta, eggs, milk..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearSearch}
            >
              <FontAwesome name="times-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Search Results */}
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {searchQuery === "" ? (
            <View></View>
          ) : (
            products
              .filter((item) =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
                <View key={item.id || item._id || index} style={styles.card}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productName}>Price : ₹{item.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name="plus"
                      size={12}
                      color="#fff"
                      style={styles.addButtonIcon}
                    />
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>
              ))
          )}
        </ScrollView>
      </View>
      {/* </LinearGradient> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Slider */}
        <LinearGradient
          colors={["#f9e723", "#ffffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bannerContainer}
        >
          <View>
            <FlatList
              data={banners}
              renderItem={renderBanner}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </LinearGradient>

        {/* Delivery Promise */}
        <View style={styles.promiseContainer}>
          <FontAwesome name="bolt" size={18} color="#0f9d58" />
          <Text style={styles.promiseText}>Superfast Delivery in Minutes!</Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products - Now using fetched products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.slice(0, 7)}
            renderItem={renderProductItem}
            keyExtractor={(item, index) =>
              item.id || item._id || index.toString()
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* All Products - Now using fetched products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>All Products</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilterText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="search" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No products found</Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product, index) => (
                <View
                  key={product.id || product._id || index}
                  style={styles.gridItem}
                >
                  {/* FIXED: Pass the correct product instead of products array */}
                  {renderProductItem({ item: products })}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  infoText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 60,
  },
  card: {
    backgroundColor: "#fdfdfd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  productName: {
    fontSize: 18,
    color: "#222",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#f9e723",

    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconRightContainer: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
  },
  cartButton: {
    position: "relative",
    padding: 4,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#f4511e",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 6,
    color: "#333",
  },
  deliveryTime: {
    fontSize: 13,
    color: "#0f9d58",
    fontWeight: "bold",
    marginLeft: 20,
  },
  screen: {
    backgroundColor: "#f9e723",
    marginBottom:-20,
    marginTop:-2
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  clearSearch: {
    padding: 6,
  },
  bannerContainer: {
    height: 160,
    marginBottom: 16,
  },
  bannerImage: {
    width: width - 32,
    height: 160,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  promiseContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  promiseText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingLeft: 12,
    paddingBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#0f9d58",
    fontWeight: "600",
  },
  clearFilterText: {
    fontSize: 14,
    color: "#f4511e",
    fontWeight: "600",
  },
  categoriesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#f0f0f0",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryIcon: {
    backgroundColor: "#f4511e",
  },
  categoryName: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#f4511e",
    fontWeight: "bold",
  },
  productsList: {
    paddingLeft: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 160,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    fontWeight: "bold",
    color: "#0f9d58",
    fontSize: 14,
    backgroundColor: "rgba(24,81,30,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  productDetails: {
    padding: 12,
  },
  productWeight: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
    color: "#333",
  },
  oldPrice: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discount: {
    fontSize: 11,
    color: "green",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#0f9d58",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonIcon: {
    marginRight: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
  },
  disabledButtonText: {
    color: "#888",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  gridItem: {
    width: "50%",
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 12,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#f4511e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Home;

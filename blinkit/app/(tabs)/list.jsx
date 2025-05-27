import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const categories = [
  { 
    id: "1", 
    title: "Fresh Vegetables", 
    image: "https://source.unsplash.com/400x400/?vegetables,fresh", 
    gradient: ['#00C851', '#007E33'],
    icon: "🥬",
    subtitle: "Farm Fresh Daily"
  },
  { 
    id: "2", 
    title: "Dairy & Eggs", 
    image: "https://source.unsplash.com/400x400/?milk,dairy", 
    gradient: ['#4285F4', '#1266F1'],
    icon: "🥛",
    subtitle: "Pure & Organic"
  },
  { 
    id: "3", 
    title: "Premium Snacks", 
    image: "https://source.unsplash.com/400x400/?snacks,premium", 
    gradient: ['#FF6900', '#FF8500'],
    icon: "🍿",
    subtitle: "Guilt-free Treats"
  },
  { 
    id: "4", 
    title: "Fresh Beverages", 
    image: "https://source.unsplash.com/400x400/?juice,beverages", 
    gradient: ['#FF3D71', '#FF6B9D'],
    icon: "🧃",
    subtitle: "Natural & Refreshing"
  },
  { 
    id: "5", 
    title: "Home Essentials", 
    image: "https://source.unsplash.com/400x400/?cleaning,home", 
    gradient: ['#8E44AD', '#BB6BD9'],
    icon: "🧽",
    subtitle: "Eco-friendly Care"
  },
  { 
    id: "6", 
    title: "Artisan Bakery", 
    image: "https://source.unsplash.com/400x400/?bakery,bread", 
    gradient: ['#F39C12', '#F7DC6F'],
    icon: "🥖",
    subtitle: "Freshly Baked"
  },
];

export default function Categories() {
  const router = useRouter();
  const [pressedItem, setPressedItem] = useState(null);

  const handlePressIn = (id) => {
    setPressedItem(id);
  };

  const handlePressOut = () => {
    setPressedItem(null);
  };

  const renderItem = ({ item, index }) => {
    const isPressed = pressedItem === item.id;
    const animatedStyle = {
      transform: [{ scale: isPressed ? 0.95 : 1 }],
      opacity: isPressed ? 0.8 : 1,
    };

    return (
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/category/${item.title}`)}
          onPressIn={() => handlePressIn(item.id)}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {/* Background Image with Overlay */}
          <Image source={{ uri: item.image }} style={styles.backgroundImage} />
          <LinearGradient
            colors={[...item.gradient, 'rgba(0,0,0,0.3)']}
            style={styles.gradientOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Floating Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
          </View>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            
            {/* Explore Button */}
            <View style={styles.exploreButton}>
              <Text style={styles.exploreText}>Explore →</Text>
            </View>
          </View>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Premium Categories</Text>
        <Text style={styles.headerSubtitle}>Curated collections for your lifestyle</Text>
      </View>
      
      {/* Categories Grid */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a202c",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
  },
  card: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  iconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  categoryIcon: {
    fontSize: 24,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },
  exploreText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  decorativeCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: -20,
    left: -20,
  },
  decorativeCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 20,
    right: -15,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
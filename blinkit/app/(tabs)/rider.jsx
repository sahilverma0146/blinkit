import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BlinkitRiderDashboard() {
//   const [user, setUser] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayStats, setTodayStats] = useState({
    deliveries: 0,
    earnings: "₹0",
    rating: 0,
    onlineTime: "0h 0m",
    totalKilometers: 0,
  });

  useEffect(() => {
    fetchAssignedOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchAssignedOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await AsyncStorage.getItem("data");
      if (!userData) {
        setError("No user data found");
        Alert.alert("Error", "Please login again");
        return;
      }

      const user = JSON.parse(userData);
    //   setUser(user);
    const riderId = user.user.id;
      console.log("Fetching orders for user:", user.id); // Ensure this is a valid ObjectId string

      const response = await fetch(
        "http://192.168.101.7:5000/api/getAssignedOrders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${user.token}` // If backend requires token
          },
          body: JSON.stringify({
            riderId: riderId, // Must be ObjectId-compatible string
          }),
        }
      );

      const data = await response.json();
      console.log("Received orders data:", data.orders);

      if (data.success && Array.isArray(data.orders)) {
        const undeliveredOrders = data.orders.filter(
          (order) => order.status !== "delivered"
        );
        const deliveredOrdersList = data.orders.filter(
          (order) => order.status === "delivered"
        );

        console.log("Delivered orders count:", deliveredOrdersList.length);
        console.log("First delivered order:", deliveredOrdersList[0]);

        setDeliveredOrders(deliveredOrdersList);
        console.log("Undelivered orders:", undeliveredOrders.length);

        if (undeliveredOrders.length > 0) {
          const latestOrder = undeliveredOrders[0];

          setCurrentOrder({
            id: latestOrder._id,

            customer: latestOrder.customerName || "Customer",
            address: latestOrder.deliveryAddress || "Address not available",
            items: latestOrder.items || [],
            amount: `₹${latestOrder.total || 0}`,
            distance: `${latestOrder.kilometers || 0} km`,
            timeLeft: "15 mins",
            userId: latestOrder.userId,
            branchId: latestOrder.branchId,
            status: latestOrder.status,
          });

          setDeliveredOrders(deliveredOrdersList);

          const todayOrders = data.orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const today = new Date();
            return orderDate.toDateString() === today.toDateString();
          });

          const totalKm = todayOrders.reduce(
            (sum, order) => sum + (parseFloat(order.kilometers) || 0),
            0
          );
          const totalEarnings = todayOrders.reduce(
            (sum, order) => sum + (parseFloat(order.total) || 0),
            0
          );

          setTodayStats({
            deliveries: todayOrders.length,
            earnings: `₹${totalEarnings.toFixed(2)}`,
            rating: 4.8,
            onlineTime: "6h 30m",
            totalKilometers: totalKm.toFixed(1),
          });
        } else {
          setCurrentOrder(null);
        }
      } else {
        console.error("API Error:", data);
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      Alert.alert("Error", "Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    console.log(currentOrder, "sasasasasasa");

    if (!currentOrder) return;
    const orderId = currentOrder.userId;
    Alert.alert(orderId);
    try {
      const userData = await AsyncStorage.getItem("data");
      if (!userData) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const user = JSON.parse(userData);

      // First mark the order as delivered
      const deliveryResponse = await fetch(
        `http://192.168.101.7:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            //   'Authorization': `Bearer ${user.token}` // Add token if required
          },
          body: JSON.stringify({
            status: "delivered",
            riderId: "68334a9173cd11674090ed62",
          }),
        }
      );

      const deliveryData = await deliveryResponse.json();

      if (deliveryData.success) {
        Alert.alert("yes");
      } else {
        Alert.alert("no");
      }
      //   if (deliveryData.success) {
      //     // Update inventory
      //     const productId = items.map(item => item._id);
      //     const inventoryResponse = await fetch(
      //       `http://192.168.101.7:5000/api/inventory/update/${productId}`,
      //       {
      //         method: "PUT",
      //         headers: {
      //           "Content-Type": "application/json",
      //         //   Authorization: `Bearer ${user.token}`,
      //         },
      //         body: JSON.stringify({
      //           orderId: currentOrder.id,
      //           branchId: currentOrder.branchId,
      //           items: currentOrder.items,
      //         }),
      //       }
      //     );

      //     const inventoryData = await inventoryResponse.json();

      //     if (inventoryData.success) {
      //       setCurrentOrder(null);
      //       await fetchAssignedOrders(); // Refresh orders
      //       Alert.alert(
      //         "Success",
      //         "Order marked as delivered and inventory updated"
      //       );
      //     } else {
      //       console.error("Inventory update failed:", inventoryData);
      //       Alert.alert(
      //         "Warning",
      //         "Order delivered but inventory update failed. Please notify admin."
      //       );
      //     }
      //   } else {
      //     console.error("Delivery status update failed:", deliveryData);
      //     Alert.alert(
      //       "Error",
      //       deliveryData.message || "Failed to update order status"
      //     );
      //   }
    } catch (error) {
      console.error("Error in handleMarkDelivered:", error);
      Alert.alert("Error", "Failed to mark order as delivered");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.riderName}>drax</Text>
              <Text style={styles.riderId}>ID: RD12345</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.statusToggle,
              isOnline ? styles.online : styles.offline,
            ]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <Text style={styles.statusText}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Order Card */}
        {isOnline && currentOrder && (
          <View style={styles.currentOrderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>Current Delivery</Text>
              {/* <Text style={styles.orderId}>{currentOrder.id}</Text> */}
              <Text style={styles.orderId}>{currentOrder.userId}</Text>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{currentOrder.customer}</Text>
              <Text style={styles.customerAddress}>{currentOrder.address}</Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.orderStat}>
                <Text style={styles.statValue}>
                  {currentOrder.items.length}
                </Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.orderStat}>
                <Text style={styles.statValue}>{currentOrder.amount}</Text>
                <Text style={styles.statLabel}>Amount</Text>
              </View>
              <View style={styles.orderStat}>
                <Text style={styles.statValue}>{currentOrder.distance}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.orderStat}>
                <Text style={[styles.statValue, styles.timeLeft]}>
                  {currentOrder.timeLeft}
                </Text>
                <Text style={styles.statLabel}>ETA</Text>
              </View>
            </View>

            <View style={styles.orderActions}>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>📞 Call Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigationButton}>
                <Text style={styles.navigationButtonText}>🗺️ Navigate</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deliveredButton}
              onPress={handleMarkDelivered}
            >
              <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayStats.deliveries}</Text>
              <Text style={styles.statText}>Deliveries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayStats.earnings}</Text>
              <Text style={styles.statText}>Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {todayStats.totalKilometers}km
              </Text>
              <Text style={styles.statText}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayStats.rating}</Text>
              <Text style={styles.statText}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivered Orders */}
        <View style={styles.recentOrders}>
          <Text style={styles.sectionTitle}>Delivered Orders</Text>
          {deliveredOrders && deliveredOrders.length > 0 ? (
            deliveredOrders.map((order, index) => (
              <View key={index} style={styles.recentOrderItem}>
                <View style={styles.recentOrderInfo}>
                  <Text style={styles.recentOrderId}>
                    #{order._id ? order._id.toString().slice(-6) : "N/A"}
                  </Text>
                  <Text style={styles.recentOrderCustomer}>
                    {order.customerName || "Unknown Customer"}
                  </Text>
                  <Text style={styles.recentOrderDistance}>
                    {order.kilometers || "0"} km
                  </Text>
                  <Text style={styles.recentOrderTime}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString()
                      : "Time N/A"}
                  </Text>
                </View>
                <View style={styles.recentOrderAmount}>
                  <Text style={styles.recentOrderPrice}>
                    ₹{order.total || "0"}
                  </Text>
                  <View style={styles.deliveredBadge}>
                    <Text style={styles.deliveredBadgeText}>✓ Delivered</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
              No delivered orders yet
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  riderName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  riderId: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  statusToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  online: {
    backgroundColor: "white",
  },
  offline: {
    backgroundColor: "transparent",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#4CAF50",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentOrderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderId: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderStat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeLeft: {
    color: "#FF6B6B",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  orderActions: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
  },
  navigationButton: {
    flex: 1,
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  navigationButtonText: {
    color: "white",
    fontWeight: "600",
  },
  deliveredButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deliveredButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  recentOrders: {
    marginBottom: 20,
  },
  recentOrderItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  recentOrderInfo: {
    flex: 1,
  },
  recentOrderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  recentOrderCustomer: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  recentOrderTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  recentOrderAmount: {
    alignItems: "flex-end",
  },
  recentOrderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deliveredBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  deliveredBadgeText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
  },
  recentOrderDistance: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontWeight: "500",
  },
});

// export default BlinkitRiderDashboard;

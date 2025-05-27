import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  RefreshControl,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState(null);
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState(null);
  const [kilometers, setKilometers] = useState('');
  const [showKilometersModal, setShowKilometersModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const fetchOrders = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const user = JSON.parse(userData);

      if (!user) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const response = await fetch("http://192.168.101.7:5000/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const transformed = data.orders.map((order) => ({
          id: order._id,
          customerName: order.name || "Unknown",
          customerEmail: order.email || "N/A",
          branch: order.branchId?.branchName || "N/A",
          pincode: order.pincode || "N/A",
          deliveryAgent: order.deliveryAgentId?.name || "Unassigned",
          total: order.total || 0,
          status: order.status || "pending",
          items: order.items.map((i) => ({
            product: i.name || "Unknown",
            category: i.category || "Unknown",
            quantity: i.quantity,
          })),
          createdAt: order.createdAt,
          kilometers: order.kilometers,
        }));
        setOrders(transformed);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to connect to server");
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);

      const userData = await AsyncStorage.getItem("data");
      if (!userData) {
        throw new Error("User not authenticated");
      }
      const user = JSON.parse(userData);

      const statusMap = {
        confirmed: "confirmed",
        preparing: "preparing",
        out_for_delivery: "out_for_delivery",
        delivered: "delivered",
        cancelled: "cancelled",
        pending: "pending",
      };

      const response = await fetch(
        `http://192.168.101.7:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ 
            status: statusMap[newStatus.toLowerCase()] || newStatus.toLowerCase() 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const data = await response.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: statusMap[newStatus.toLowerCase()] || newStatus.toLowerCase() } : order
          )
        );
        Alert.alert("Success", `Order status updated to ${newStatus}`);
      } else {
        throw new Error(data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to update order status. Please try again."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fetchDeliveryAgents = async (order) => {
    try {
      setLoadingAgents(true);
      const userData = await AsyncStorage.getItem("data");
      if (!userData) {
        throw new Error("User not authenticated");
      }
      const user = JSON.parse(userData);

      const branchId = user.user.id;
      const response = await fetch(
        `http://192.168.101.7:5000/api/getDeliveryAgent/${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        const activeAgents = data.deliveryAgents
          .filter((agent) => agent.isActive !== false)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setDeliveryAgents(activeAgents);
        setSelectedOrderForAssignment(order);
        setShowAssignModal(true);
      } else {
        throw new Error(data.message || "Failed to fetch delivery agents");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to fetch delivery agents. Please try again."
      );
    } finally {
      setLoadingAgents(false);
    }
  };

  const assignDeliveryAgent = async (orderId, agentId, kilometers) => {
    try {
      if (!orderId || !agentId || !kilometers) {
        throw new Error("Order ID, Agent ID, and kilometers are required");
      }

      const userData = await AsyncStorage.getItem("data");
      if (!userData) {
        throw new Error("User not authenticated");
      }
      const user = JSON.parse(userData);

      const response = await fetch(
        `http://192.168.101.7:5000/api/assignDeliveryAgent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            orderId,
            deliveryAgentId: agentId,
            kilometers: kilometers,
          }),
        }
      );

     

      const data = await response.json();


      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  deliveryAgent:
                    deliveryAgents.find((agent) => agent._id === agentId)
                      ?.name || "Unknown",
                  deliveryAgentId: agentId,
                  kilometers: kilometers
                }
              : order
          )
        );
        Alert.alert("Success", "Delivery agent assigned successfully");
        setShowAssignModal(false);
        setSelectedOrderForAssignment(null);
        setSelectedDeliveryAgent(null);
      } else {
        throw new Error(data.message || "Failed to assign delivery agent");
      }
    } catch (err) {
      console.error("Assignment error:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to assign delivery agent. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    switch (normalizedStatus) {
      case "delivered":
        return {
          color: "#10B981",
          bg: "#ECFDF5",
          text: "Delivered",
          icon: "✓",
          progress: 100,
          steps: ["Order Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"],
        };
      case "out for delivery":
        return {
          color: "#F59E0B",
          bg: "#FEF3C7",
          text: "Out for Delivery",
          icon: "🚚",
          progress: 75,
          steps: ["Order Placed", "Confirmed", "Preparing", "Out for Delivery"],
        };
      case "preparing":
        return {
          color: "#6366F1",
          bg: "#EEF2FF",
          text: "Preparing",
          icon: "👨‍🍳",
          progress: 50,
          steps: ["Order Placed", "Confirmed", "Preparing"],
        };
      case "confirmed":
        return {
          color: "#3B82F6",
          bg: "#EBF8FF",
          text: "Confirmed",
          icon: "✓",
          progress: 25,
          steps: ["Order Placed", "Confirmed"],
        };
      case "pending":
        return {
          color: "#9333EA",
          bg: "#F3E8FF",
          text: "Pending",
          icon: "🕐",
          progress: 25,
          steps: ["Order Placed"],
        };
      case "cancelled":
        return {
          color: "#EF4444",
          bg: "#FEE2E2",
          text: "Cancelled",
          icon: "✕",
          progress: 0,
          steps: ["Cancelled"],
        };
      default:
        return {
          color: "#6B7280",
          bg: "#F3F4F6",
          text: status,
          icon: "○",
          progress: 25,
          steps: ["Order Placed"],
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const OrderCard = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);
    const isUpdating = updatingStatus === item.id;

    const handleStatusUpdate = (newStatus) => {
      const currentStatus = item.status.toLowerCase();
      
      // Define valid transitions for each status
      const validTransitions = {
        pending: ['confirmed'],
        confirmed: ['preparing'],
        preparing: ['out_for_delivery'],
        out_for_delivery: ['delivered'],
        delivered: [],
        cancelled: []
      };

      // Check if the transition is valid
      const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

      if (!isValidTransition) {
        Alert.alert(
          "Invalid Status Update",
          `Cannot update from ${currentStatus.replace(/_/g, " ")} to ${newStatus.replace(/_/g, " ")}.\n\nValid order flow:\npending → confirmed → preparing → out for delivery → delivered`
        );
        return;
      }

      // Additional check for out_for_delivery status
      if (newStatus === "out_for_delivery" && item.deliveryAgent === "Unassigned") {
        Alert.alert(
          "Cannot Update Status",
          "Please assign a delivery agent before marking the order as out for delivery."
        );
        return;
      }

      Alert.alert(
        "Update Order Status",
        `Are you sure you want to mark this order as ${newStatus.replace(/_/g, " ")}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => updateOrderStatus(item.id, newStatus),
          },
        ]
      );
    };

    const renderActionButton = (status, label, buttonStyle) => (
      <TouchableOpacity
        style={[
          styles.quickActionButton,
          buttonStyle,
          isUpdating && styles.disabledButton,
        ]}
        onPress={() => handleStatusUpdate(status)}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.quickActionText}>{label}</Text>
        )}
      </TouchableOpacity>
    );

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            <View style={styles.orderMeta}>
              <Text style={styles.itemCount}>
                {item.items.length} item{item.items.length > 1 ? "s" : ""}
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.orderAmount}>₹{item.total}</Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
          >
            <Text style={[styles.statusIcon, { color: statusConfig.color }]}>
              {statusConfig.icon}
            </Text>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${statusConfig.progress}%`,
                  backgroundColor: statusConfig.color,
                },
              ]}
            />
          </View>
          <View style={styles.statusSteps}>
            {statusConfig.steps.map((step, index) => (
              <View key={step} style={styles.stepContainer}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        index <= statusConfig.steps.length - 1
                          ? statusConfig.color
                          : "#E5E7EB",
                      borderColor:
                        index === statusConfig.steps.length - 1
                          ? statusConfig.color
                          : "transparent",
                      borderWidth:
                        index === statusConfig.steps.length - 1 ? 2 : 0,
                    },
                  ]}
                >
                  {index <= statusConfig.steps.length - 1 && (
                    <Text style={styles.stepCheck}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    {
                      color:
                        index <= statusConfig.steps.length - 1
                          ? statusConfig.color
                          : "#9CA3AF",
                      fontWeight:
                        index === statusConfig.steps.length - 1 ? "600" : "400",
                    },
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.customerSection}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.customerDetails}>
              <Text style={styles.branchName}>{item.branch}</Text>
              <Text style={styles.dotSeparator}> • </Text>
              <Text style={styles.pincode}>{item.pincode}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          {item.items.slice(0, 3).map((product, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{product.product}</Text>
                <Text style={styles.itemCategory}>{product.category}</Text>
              </View>
              <Text style={styles.itemQuantity}>×{product.quantity}</Text>
            </View>
          ))}
          {item.items.length > 3 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 3} more item
              {item.items.length - 3 > 1 ? "s" : ""}
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.agentInfo}>
            <Text style={styles.agentIcon}>🚚</Text>
            <Text style={styles.agentText}>{item.deliveryAgent}</Text>
            {item.kilometers && (
              <Text style={styles.distanceText}>
                ({item.kilometers} km)
              </Text>
            )}
            {isManager && item.deliveryAgent === "Unassigned" && (
              <TouchableOpacity
                style={[styles.assignButton, loadingAgents && styles.disabledButton]}
                onPress={() => fetchDeliveryAgents(item)}
                disabled={loadingAgents}
              >
                {loadingAgents ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.assignButtonText}>Assign Agent</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isManager && (
          <View style={styles.managerControls}>
            <Text style={styles.managerTitle}>Update Status</Text>
            <View style={styles.quickActions}>
              {item.status.toLowerCase() === "pending" && 
                renderActionButton("confirmed", "Confirm", styles.confirmButton)
              }
              {item.status.toLowerCase() === "confirmed" && 
                renderActionButton("preparing", "Prepare", styles.prepareButton)
              }
              {item.status.toLowerCase() === "preparing" && 
                renderActionButton("out_for_delivery", "Out for Delivery", styles.dispatchButton)
              }
              {item.status.toLowerCase() === "out_for_delivery" && 
                renderActionButton("delivered", "Deliver", styles.deliverButton)
              }

              {!["delivered", "cancelled"].includes(item.status.toLowerCase()) && (
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    styles.cancelButton,
                    isUpdating && styles.disabledButton,
                  ]}
                  onPress={() => {
                    Alert.alert(
                      "Cancel Order",
                      "Are you sure you want to cancel this order?",
                      [
                        { text: "No", style: "cancel" },
                        {
                          text: "Yes",
                          style: "destructive",
                          onPress: () => handleStatusUpdate("cancelled"),
                        },
                      ]
                    );
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.quickActionText}>Cancel</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAgentSelect = (agentId) => {
    setSelectedDeliveryAgent(agentId);
    setShowKilometersModal(true);
  };

  const handleKilometersSubmit = () => {
    if (!kilometers || isNaN(kilometers) || parseFloat(kilometers) <= 0) {
      Alert.alert("Error", "Please enter a valid distance in kilometers");
      return;
    }
    assignDeliveryAgent(selectedOrderForAssignment.id, selectedDeliveryAgent, parseFloat(kilometers));
    setShowKilometersModal(false);
    setKilometers('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {isManager ? "Order Management" : "My Orders"}
          </Text>
          {isManager && (
            <Text style={styles.headerSubtitle}>Manage order statuses</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsManager(!isManager)}
          >
            <Text style={styles.toggleText}>
              {isManager ? "👤 Customer" : "👨‍💼 Manager"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0CAD00" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No orders yet!</Text>
              <Text style={styles.emptySubtitle}>
                Your orders will appear here once you place them
              </Text>
              <TouchableOpacity style={styles.shopButton}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Agent Assignment Modal */}
      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowAssignModal(false);
          setSelectedOrderForAssignment(null);
          setSelectedDeliveryAgent(null);
          setKilometers('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Delivery Agent</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowAssignModal(false);
                  setSelectedOrderForAssignment(null);
                  setSelectedDeliveryAgent(null);
                  setKilometers('');
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Order #{selectedOrderForAssignment?.id}
            </Text>
            <Text style={styles.orderInfo}>
              Customer: {selectedOrderForAssignment?.customerName}
            </Text>

            <ScrollView style={styles.agentsContainer} showsVerticalScrollIndicator={false}>
              {deliveryAgents.length === 0 ? (
                <View style={styles.noAgentsContainer}>
                  <Text style={styles.noAgentsText}>No delivery agents available</Text>
                </View>
              ) : (
                deliveryAgents.map((agent) => (
                  <TouchableOpacity
                    key={agent._id}
                    style={styles.agentCard}
                    onPress={() => handleAgentSelect(agent._id)}
                  >
                    <View style={styles.agentCardHeader}>
                      <View style={styles.agentAvatar}>
                        <Text style={styles.agentInitial}>
                          {agent.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.agentDetails}>
                        <Text style={styles.agentName}>{agent.name}</Text>
                        <Text style={styles.agentPhone}>{agent.phone}</Text>
                        <Text style={styles.agentEmail}>{agent.email}</Text>
                      </View>
                    </View>
                    <View style={styles.agentStatus}>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: agent.status === 'available' ? '#10B981' : '#F59E0B' }
                      ]} />
                      <Text style={styles.agentStatusText}>
                        {agent.status || 'Available'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Kilometers Input Modal */}
      <Modal
        visible={showKilometersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowKilometersModal(false);
          setKilometers('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: 300 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Delivery Distance</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowKilometersModal(false);
                  setKilometers('');
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter distance in kilometers"
                keyboardType="numeric"
                value={kilometers}
                onChangeText={setKilometers}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowKilometersModal(false);
                  setKilometers('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.assignModalButton]}
                onPress={handleKilometersSubmit}
              >
                <Text style={styles.assignModalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  toggleText: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  listContainer: {
    paddingVertical: 8,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  orderInfo: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  dotSeparator: {
    fontSize: 14,
    color: "#9CA3AF",
    marginHorizontal: 8,
  },
  orderAmount: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressSection: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  statusSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  customerSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 13,
    color: "#6B7280",
  },
  branchName: {
    color: "#4B5563",
  },
  pincode: {
    color: "#6B7280",
  },
  itemsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  moreItems: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
    marginTop: 8,
  },
  orderFooter: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  agentText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  managerControls: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  managerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
  },
  prepareButton: {
    backgroundColor: "#F59E0B",
  },
  dispatchButton: {
    backgroundColor: "#8B5CF6",
  },
  deliverButton: {
    backgroundColor: "#10B981",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  assignButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  assignButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  agentPicker: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  assignModalButton: {
    backgroundColor: "#3B82F6",
  },
  assignModalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#0CAD00",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  agentCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    elevation: 2,
  },
  agentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  agentInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  agentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  agentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  agentPhone: {
    fontSize: 12,
    color: "#6B7280",
  },
  agentEmail: {
    fontSize: 12,
    color: "#6B7280",
  },
  agentStatus: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  agentStatusText: {
    fontSize: 12,
    color: "#6B7280",
  },
  distanceText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 8,
  },
  inputContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  assignModalButton: {
    backgroundColor: '#3B82F6',
  },
  cancelModalButton: {
    backgroundColor: '#F3F4F6',
  },
  assignModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666666',
  },
});

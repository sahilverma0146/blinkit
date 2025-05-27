import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        customerAddress: '123 Main St, City, State 12345',
        orderDate: '2024-05-20T10:30:00Z',
        status: 'pending',
        total: 125.50,
        items: [
          { name: 'Wireless Headphones', quantity: 1, price: 89.99 },
          { name: 'Phone Case', quantity: 2, price: 17.75 }
        ],
        paymentMethod: 'Credit Card',
        deliveryMethod: 'Standard Delivery'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1234567891',
        customerAddress: '456 Oak Ave, City, State 12345',
        orderDate: '2024-05-21T14:15:00Z',
        status: 'processing',
        total: 299.99,
        items: [
          { name: 'Laptop Stand', quantity: 1, price: 79.99 },
          { name: 'USB-C Hub', quantity: 1, price: 45.00 },
          { name: 'Wireless Mouse', quantity: 1, price: 175.00 }
        ],
        paymentMethod: 'PayPal',
        deliveryMethod: 'Express Delivery'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        customerPhone: '+1234567892',
        customerAddress: '789 Pine Rd, City, State 12345',
        orderDate: '2024-05-22T09:45:00Z',
        status: 'shipped',
        total: 67.25,
        items: [
          { name: 'Water Bottle', quantity: 2, price: 24.99 },
          { name: 'Notebook Set', quantity: 1, price: 17.27 }
        ],
        paymentMethod: 'Credit Card',
        deliveryMethod: 'Standard Delivery'
      },
      {
        id: 'ORD-004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1234567893',
        customerAddress: '321 Elm St, City, State 12345',
        orderDate: '2024-05-23T16:20:00Z',
        status: 'delivered',
        total: 189.75,
        items: [
          { name: 'Bluetooth Speaker', quantity: 1, price: 129.99 },
          { name: 'Phone Charger', quantity: 3, price: 19.92 }
        ],
        paymentMethod: 'Debit Card',
        deliveryMethod: 'Express Delivery'
      },
      {
        id: 'ORD-005',
        customerName: 'Tom Brown',
        customerEmail: 'tom@example.com',
        customerPhone: '+1234567894',
        customerAddress: '654 Maple Dr, City, State 12345',
        orderDate: '2024-05-24T11:10:00Z',
        status: 'cancelled',
        total: 45.00,
        items: [
          { name: 'Screen Cleaner Kit', quantity: 1, price: 15.00 },
          { name: 'Cable Organizer', quantity: 2, price: 15.00 }
        ],
        paymentMethod: 'Credit Card',
        deliveryMethod: 'Standard Delivery'
      }
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const getStatusIcon = (status) => {
    const iconProps = { size: 16, style: { marginRight: 4 } };
    switch (status) {
      case 'pending': return <Icon name="access-time" color="#F59E0B" {...iconProps} />;
      case 'processing': return <Icon name="info" color="#3B82F6" {...iconProps} />;
      case 'shipped': return <Icon name="local-shipping" color="#8B5CF6" {...iconProps} />;
      case 'delivered': return <Icon name="check-circle" color="#10B981" {...iconProps} />;
      case 'cancelled': return <Icon name="cancel" color="#EF4444" {...iconProps} />;
      default: return <Icon name="access-time" color="#6B7280" {...iconProps} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'processing': return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'shipped': return { backgroundColor: '#EDE9FE', color: '#7C3AED' };
      case 'delivered': return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'cancelled': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportOrders = () => {
    Alert.alert(
      'Export Orders',
      'Export functionality would be implemented here. On mobile, you might share the data or save to device storage.',
      [{ text: 'OK' }]
    );
  };

  const renderStatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { width: (width - 48) / 2 - 8 }]}>
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </View>
    </View>
  );

  const renderOrderItem = ({ item: order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderItems}>
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.customerEmail}>{order.customerEmail}</Text>
        <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
      </View>
      
      <View style={styles.orderFooter}>
        <View style={[styles.statusBadge, getStatusColor(order.status)]}>
          {getStatusIcon(order.status)}
          <Text style={[styles.statusText, { color: getStatusColor(order.status).color }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
        
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSelectedOrder(order)}
          >
            <Icon name="visibility" size={20} color="#3B82F6" />
          </TouchableOpacity>
          
          <View style={styles.statusPicker}>
            <Picker
              selectedValue={order.status}
              onValueChange={(value) => updateOrderStatus(order.id, value)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Processing" value="processing" />
              <Picker.Item label="Shipped" value="shipped" />
              <Picker.Item label="Delivered" value="delivered" />
              <Picker.Item label="Cancelled" value="cancelled" />
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Order Management</Text>
          <Text style={styles.headerSubtitle}>Manage and track all customer orders</Text>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={exportOrders}>
          <Icon name="file-download" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          {renderStatCard({
            title: 'Total Orders',
            value: orders.length.toString(),
            icon: 'inventory',
            color: '#3B82F6'
          })}
          {renderStatCard({
            title: 'Pending',
            value: orders.filter(o => o.status === 'pending').length.toString(),
            icon: 'access-time',
            color: '#F59E0B'
          })}
          {renderStatCard({
            title: 'Processing',
            value: orders.filter(o => o.status === 'processing').length.toString(),
            icon: 'info',
            color: '#3B82F6'
          })}
          {renderStatCard({
            title: 'Delivered',
            value: orders.filter(o => o.status === 'delivered').length.toString(),
            icon: 'check-circle',
            color: '#10B981'
          })}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders, customers, or emails..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          
          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={statusFilter}
                onValueChange={setStatusFilter}
                style={styles.filterPicker}
              >
                <Picker.Item label="All Status" value="all" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Processing" value="processing" />
                <Picker.Item label="Shipped" value="shipped" />
                <Picker.Item label="Delivered" value="delivered" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </View>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={dateFilter}
                onValueChange={setDateFilter}
                style={styles.filterPicker}
              >
                <Picker.Item label="All Time" value="all" />
                <Picker.Item label="Today" value="today" />
                <Picker.Item label="Last Week" value="week" />
                <Picker.Item label="Last Month" value="month" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="inventory" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No orders found</Text>
          </View>
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={selectedOrder !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TouchableOpacity onPress={() => setSelectedOrder(null)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Order Info */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Order Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Order ID:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.id}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(selectedOrder.orderDate)}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <View style={[styles.statusBadge, getStatusColor(selectedOrder.status)]}>
                      {getStatusIcon(selectedOrder.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status).color }]}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Payment & Delivery */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Payment & Delivery</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Payment:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.paymentMethod}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Delivery:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.deliveryMethod}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Total:</Text>
                    <Text style={[styles.infoValue, styles.totalAmount]}>${selectedOrder.total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Customer Info */}
              <View style={styles.modalSection}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="person" size={20} color="#374151" />
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{selectedOrder.customerName}</Text>
                  <Text style={styles.customerDetail}>{selectedOrder.customerEmail}</Text>
                  <View style={styles.customerDetailRow}>
                    <Icon name="phone" size={16} color="#6B7280" />
                    <Text style={styles.customerDetail}>{selectedOrder.customerPhone}</Text>
                  </View>
                  <View style={styles.customerDetailRow}>
                    <Icon name="location-on" size={16} color="#6B7280" />
                    <Text style={styles.customerDetail}>{selectedOrder.customerAddress}</Text>
                  </View>
                </View>
              </View>

              {/* Items */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedOrder(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                
                <View style={styles.statusUpdateContainer}>
                  <Picker
                    selectedValue={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    style={styles.statusUpdatePicker}
                  >
                    <Picker.Item label="Mark as Pending" value="pending" />
                    <Picker.Item label="Mark as Processing" value="processing" />
                    <Picker.Item label="Mark as Shipped" value="shipped" />
                    <Picker.Item label="Mark as Delivered" value="delivered" />
                    <Picker.Item label="Mark as Cancelled" value="cancelled" />
                  </Picker>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  exportButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterPicker: {
    height: 40,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orderItems: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orderInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  customerEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  statusPicker: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    minWidth: 120,
  },
  picker: {
    height: 40,
    width: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoGrid: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginTop: 2,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  customerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  customerDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 32,
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  statusUpdateContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    minWidth: 180,
  },
  statusUpdatePicker: {
    height: 40,
    width: 180,
  },
});
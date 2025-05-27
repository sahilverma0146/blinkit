import { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://your-backend/api/delivery/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Assigned Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>Order #{item._id}</Text>
            <Text>{item.address}</Text>
            <Button title="Mark as Delivered" onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
}

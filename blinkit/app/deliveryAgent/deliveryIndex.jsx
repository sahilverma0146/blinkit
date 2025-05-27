import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function DeliveryDashboard() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Delivery Agent Panel</Text>
      <Button title="View Orders" onPress={() => router.push('/deliveryAgent/order')} />
    </View>
  );
}

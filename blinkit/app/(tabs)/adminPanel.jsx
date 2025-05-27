import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Admin Dashboard</Text>
      {/* <Button
        title="Manage Products"
        onPress={() => router.push("/admin/manageproducts")}
      /> */}
      <Button
      
        title="Add new Branch Manager"
        onPress={() => router.push("/admin/newBranchManager")}
      />

      <Button
        title="orders"
        onPress={() => router.push("/admin/orderDetails")}
      />
    </View>
  );
}

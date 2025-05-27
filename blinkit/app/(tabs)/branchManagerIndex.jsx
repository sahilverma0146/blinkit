import { useRouter } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "react-native";

function BranchManagerDashboard() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Branch Manager Panel
      </Text>
      <Button
        title="Manage Inventory"
        onPress={() => router.push("/(branchManager)/inventory")}
      />
      <Button
        title=" Orders"
        onPress={() => router.push("/(component)/allOrder")}
      />

      <Button
        title=" ALL Listed Products"
        onPress={() => router.push("/(branchManager)/ListedProducts")}
      />

       <TouchableOpacity onPress={()=>router.push('/deliveryAgent/deliveryagemt')}>
        <Text>sdj</Text>
       </TouchableOpacity>

    </View>
  );
}
export default BranchManagerDashboard;

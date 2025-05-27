import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24 }}>Hello hi 👋</Text>
      <Button title="Go to Tabs" onPress={() => router.push("(tabs)/home")} />
      {/* <Button title="Go to login" onPress={() => router.push("(auth)/mainF")} /> */}
    </View>
  );
}

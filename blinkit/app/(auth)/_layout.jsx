import { Tabs } from "expo-router";

export default function AuthLayout() {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="signup" options={{ title: "Home" , headerShown:false  }} />
        
      </Tabs>
    </>
  );
}

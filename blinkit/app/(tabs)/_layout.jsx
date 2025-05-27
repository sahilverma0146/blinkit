import { Tabs } from "expo-router";
import { useContext, useEffect } from "react";
import { LoginContext } from "@/context/authContext";
// import { AuthContext } from "@/context/roleContext";
// import { HeaderShownContext } from "@react-navigation/elements";
export default function TabsLayout() {
  const { user, loading } = useContext(LoginContext);

  if (loading) return null;

  console.log({ user }, "the desked");
  useEffect(() => {
    if (!loading) {
      console.log("User loaded:", user);
    }
  }, [loading]);

  return (
    <Tabs
      options={{
        headerShown: false,
      }}
    >
      {/* <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="list" options={{ title: "list" }} />
      <Tabs.Screen name="orderAgain" options={{ title: "summary" }} />
      <Tabs.Screen name="profile" options={{ title: "profile" }} /> */}
      {/* <Tabs.Screen name="rider" options={{ title: "rider DashBoard" }} /> */}

      {user.role === "user" || user.role === "admin" ? (
        <Tabs.Screen
          name="home"
          options={{
            
            href: "/(tabs)/home",
          }}
        />
      ) : (
        <Tabs.Screen
          name="home"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "user" ? (
        <Tabs.Screen
          name="list"
          options={{
            href: "/(tabs)/list",
          }}
        />
      ) : (
        <Tabs.Screen
          name="list"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "user" ? (
        <Tabs.Screen
          name="orderAgain"
          options={{
            href: "/(tabs)/orderAgain",
          }}
        />
      ) : (
        <Tabs.Screen
          name="orderAgain"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "admin" ? (
        <Tabs.Screen
          name="adminPanel"
          options={{
            href: "/(tabs)/adminPanel",
          }}
        />
      ) : (
        <Tabs.Screen
          name="adminPanel"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "admin" || user.role === "branchManager" ? (
        <Tabs.Screen
          name="branchManagerIndex"
          options={{
            href: "/(tabs)/branchManagerIndex",
          }}
        />
      ) : (
        <Tabs.Screen
          name="branchManagerIndex"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "delivery_agent" ? (
        <Tabs.Screen
          name="rider"
          options={{
            href: "/(tabs)/rider",
          }}
        />
      ) : (
        <Tabs.Screen
          name="rider"
          options={{
            href: null,
          }}
        />
      )}

      {user.role === "user" ||
      user.role === "delivery_agent" ||
      user.role === "admin" ||
      user.role === "branchManager" ? (
        <Tabs.Screen
          name="profile"
          options={{
            href: "/(tabs)/profile",
          }}
        />
      ) : (
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      )}
    </Tabs>
  );
}

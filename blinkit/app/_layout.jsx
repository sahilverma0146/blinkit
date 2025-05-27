import { CartProvider } from "@/context/cartContext";
import { ProductProvider } from "@/context/productContext";
// import { AuthProvider } from "@/context/roleContext";
import { LoginContext, LoginProvider } from "@/context/authContext";

import { Stack } from "expo-router";
import { useContext } from "react";

function LayoutWithUserGuard() {
  const { user } = useContext(LoginContext);

  
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
        redirect={!user} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // <AuthProvider>
      <LoginProvider>
        <ProductProvider>
          <CartProvider>
            <LayoutWithUserGuard />
          </CartProvider>
        </ProductProvider>
      </LoginProvider>
    // </AuthProvider>
  );
}

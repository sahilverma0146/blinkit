// screens/CartScreen.js
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { CartContext } from "@/context/cartContext";

function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);

  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const increment = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  const decrement = (item) => {
    if (item.quantity > 1) {
      removeFromCart(item.id);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹ {item.price.toFixed(2)}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => decrement(item)} style={styles.btn}>
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increment(item)} style={styles.btn}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <TouchableOpacity onPress={clearCart} style={{ margin: 10 }}>
        <Text style={{ color: "red", textAlign: "center" }}>Clear Cart</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>Your cart is empty</Text>
          }
        />
        {cartItems.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹ {getTotal()}</Text>
            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

export default Cart;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  image: { width: 70, height: 70, borderRadius: 8 },
  details: { flex: 1, marginLeft: 10, justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "#555" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 18 },
  qty: { marginHorizontal: 10, fontSize: 16 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16 },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: "#0f9d58",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

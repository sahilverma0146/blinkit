import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [Product, setProduct] = useState([
    {
      id: "1",
      name: "Fresh Tomatoes",
      price: 42,
      oldPrice: 60,
      weight: "500g",
      inStock: true,
      category: "Beverages",
    },
    {
      id: "2",
      name: "Onions",
      price: 28,
      oldPrice: 35,
      weight: "1kg",
      inStock: true,
      category: "Vegetables",
    },
    {
      id: "3",
      name: "Bananas",
      price: 60,
      oldPrice: 75,
      weight: "1 dozen",
      inStock: true,
      category: "Fruits",
    },
    {
      id: "4",
      name: "Bread",
      price: 35,
      oldPrice: 40,
      weight: "400g",
      inStock: false,
      category: "Bakery",
    },
    {
      id: "5",
      name: "Milk",
      price: 60,
      oldPrice: 65,
      weight: "500ml",
      inStock: true,
      category: "Dairy",
    },
    {
      id: "6",
      name: "Eggs",
      price: 75,
      oldPrice: 90,
      weight: "6 pcs",
      inStock: true,
      category: "Dairy",
    },
  ]);

 

  const updateProduct = (updatedProduct) => {
    setProduct((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const addNewProduct = (newProduct) => {
    setProduct((prev) => {
      const exists = prev.some((p) => p.id === newProduct.id);
      if (exists) {
        return prev;
      } else {
        return [...prev, newProduct];
      }
    });
  };

  const deleteProduct = (productToDelete) => {
    setProduct((prev) => prev.filter((item) => item.id !== productToDelete.id));
  };

  return (
    <>
      <ProductContext.Provider
        value={{ Product, updateProduct, addNewProduct, deleteProduct }}
      >
        {children}
      </ProductContext.Provider>
    </>
  );
};

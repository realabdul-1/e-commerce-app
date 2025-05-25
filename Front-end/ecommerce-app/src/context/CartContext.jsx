import React, { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    if (!product || quantity < 1 || product.stock <= 0) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  }

  function removeFromCart(productId) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartTotal() {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

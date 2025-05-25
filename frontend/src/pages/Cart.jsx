// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "../styles/Cart.module.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (!cartItems.length) {
    return <p className={styles.center}>Your cart is empty.</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Your Cart</h1>
      {cartItems.map(item=>(
        <div key={item.id} className={styles.item}>
          <img
            src={item.image_url}
            alt={item.name}
            className={styles.cartImage}
            onError={e=>e.target.src="/products/default.png"}
          />
          <div className={styles.details}>
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <div>
              Qty:{" "}
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={e=>updateQuantity(item.id, Number(e.target.value))}
                className={styles.inputQty}
              />
            </div>
            <button onClick={()=>removeFromCart(item.id)} className={styles.button}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <h2 className={styles.total}>Total: ${getCartTotal().toFixed(2)}</h2>
      <div className={styles.actions}>
        <button onClick={clearCart} className={styles.clearButton}>
          Clear Cart
        </button>
        <button onClick={()=>navigate("/checkout")} className={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import closeIcon from "../assets/icons/close-icon.svg";
import styles from "../styles/ProductList.module.css";

export default function ProductModal({ product, onClose }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <img
          src={closeIcon}
          alt="Close modal"
          className={styles.closeIcon}
          onClick={onClose}
        />
        <a href={product.image_url} target="_blank" rel="noopener noreferrer">
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.modalImage}
            onError={(e) => (e.target.src = "/products/default.png")}
          />
        </a>

        <h3 className={styles.modalTitle}>{product.name}</h3>
        <p className={styles.modalDescription}>{product.description}</p>
        <p className={styles.modalPrice}>${product.price.toFixed(2)}</p>

        {!added && (
          <div className={styles.quantityControl}>
            <label>Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
              }
              className={styles.qtyInput}
            />
          </div>
        )}

        {added && (
          <p className={styles.successMessage}>✅ Added to cart!</p>
        )}

        {!added ? (
          <button onClick={handleAdd} className={styles.addToCartButton}>
            Add to Cart
          </button>
        ) : (
          <div className={styles.modalButtons}>
            <button onClick={onClose} className={styles.confirmButton}>
              Continue Shopping
            </button>
            <button onClick={() => navigate("/cart")} className={styles.confirmButton}>
              View Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

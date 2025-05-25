import React, { useState } from "react";
import styles from "../styles/ProductList.module.css";
import ProductModal from "../components/ProductModal";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className={styles.productCard}>
        <div onClick={openModal} className={styles.cardContent}>
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.productImage}
            onError={(e) => (e.target.src = "/products/default.png")}
          />
          <p className={styles.productCategory}>Category: {product.category}</p>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>
            {product.description.length > 80
              ? product.description.slice(0, 80) + "…"
              : product.description}
          </p>
          <p>
            <b>${product.price.toFixed(2)}</b>
          </p>
          <p className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
          </p>
        </div>
        {product.stock > 0 && (
          <button className={styles.addToCart} onClick={openModal}>
            Add to Cart
          </button>
        )}
      </div>

      {showModal && <ProductModal product={product} onClose={closeModal} />}
    </>
  );
}

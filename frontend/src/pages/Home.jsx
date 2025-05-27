// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Carousel from "../components/Carousel";
import ProductCard from "../components/MostPurchasesItems";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [sortOpt, setSortOpt] = useState("default");

  const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://your-backend.onrender.com';

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => {
        const uniqueProducts = Array.from(new Map(res.data.map(p => [p.id, p])).values());
        setProducts(
          uniqueProducts
            .sort((a, b) => b.purchases - a.purchases)
            .slice(0, 6)
        );
      })
      .catch(console.error);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch(sortOpt) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  return (
    <>
      <Carousel />
      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.heading}>Most Purchased Jewelry</h2>
          
          {/* Add Sorting Controls */}
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <label>Sort by:</label>
              <select
                value={sortOpt}
                onChange={(e) => setSortOpt(e.target.value)}
                className={styles.select}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low→High</option>
                <option value="price-high">Price: High→Low</option>
                <option value="name-asc">Name: A→Z</option>
                <option value="name-desc">Name: Z→A</option>
              </select>
            </div>
          </div>

          <div className={styles.productsGrid}>
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
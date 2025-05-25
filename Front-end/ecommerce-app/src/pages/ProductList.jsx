import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/ProductList.module.css";
import ProductModal from "../components/ProductModal";
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortOpt, setSortOpt] = useState("default");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (catFilter !== "all") result = result.filter((p) => p.category === catFilter);
    if (sortOpt === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortOpt === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortOpt === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOpt === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));
    setFiltered(result);
  }, [sortOpt, catFilter, products]);

  const cats = ["all", ...new Set(products.map((p) => p.category))];

  const openModal = (p) => setSelected(p);
  const closeModal = () => setSelected(null);

  if (loading) return <p className={styles.center}>Loading…</p>;
  if (error) return <p className={styles.center}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Products</h1>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Category:</label>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={styles.select}
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
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

      <div className={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} className={styles.productCard}>
            <div onClick={() => openModal(p)} className={styles.cardContent}>
              <img
                src={p.image_url}
                alt={p.name}
                className={styles.productImage}
                onError={(e) => (e.target.src = "/products/default.png")}
              />
              <p className={styles.productCategory}>Category: {p.category}</p>
              <h3 className={styles.productName}>{p.name}</h3>
              <p className={styles.productDescription}>
                {p.description.length > 80
                  ? p.description.slice(0, 80) + "…"
                  : p.description}
              </p>
              <p>
                <b>${p.price.toFixed(2)}</b>
              </p>
              <p className={p.stock > 0 ? styles.inStock : styles.outOfStock}>
                {p.stock > 0 ? `In stock: ${p.stock}` : "Out of stock"}
              </p>
            </div>
            {p.stock > 0 && (
              <button className={styles.addToCart} onClick={() => openModal(p)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {selected && <ProductModal product={selected} onClose={closeModal} />}
    </div>
  );
}

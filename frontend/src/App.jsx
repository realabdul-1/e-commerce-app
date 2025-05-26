import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/checkout";
import Contact from "./pages/Contact";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import styles from "./styles/App.module.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className={styles.appContainer}>
            <Header />
            <main className={styles.main}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

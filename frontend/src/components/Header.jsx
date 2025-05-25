// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";        
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo.png";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const togglePanel = () => setOpen(o => !o);
  const closePanel = () => setOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <NavLink to="/" className={styles.logoContainer}>
            <img src={logo} alt="Diamond Heart" className={styles.logo} />
            <span className={styles.brand}>Diamond Heart</span>
          </NavLink>

          {/* DESKTOP NAV */}
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? styles.navLinkActive : styles.navLink
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? styles.navLinkActive : styles.navLink
                }
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? styles.navLinkActive : styles.navLink
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* RIGHT SECTION */}
          <div className={styles.rightSection}>
            <NavLink to="/cart" className={styles.cartIcon}>
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className={styles.cartCount}>{cartItems.length}</span>
              )}
            </NavLink>

            {user ? (
              <>
                <span className={styles.userGreeting}>
                  Hi, {user.username}
                </span>
                <button onClick={logout} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? styles.navLinkActive : styles.navLink
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* HAMBURGER */}
          <button className={styles.hamburger} onClick={togglePanel}>
            <FaBars />
          </button>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={closePanel}
      />

      {/* SIDE PANEL */}
      <nav className={`${styles.sidePanel} ${open ? styles.open : ""}`}>
        <button className={styles.closeBtn} onClick={closePanel}>
          ×
        </button>
        <ul className={styles.sidePanelLinks}>
          <li>
            <NavLink
              to="/"
              end
              onClick={closePanel}
              className={({ isActive }) =>
                isActive ? styles.sideLinkActive : styles.sideLink
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              onClick={closePanel}
              className={({ isActive }) =>
                isActive ? styles.sideLinkActive : styles.sideLink
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={closePanel}
              className={({ isActive }) =>
                isActive ? styles.sideLinkActive : styles.sideLink
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
        <div className={styles.sidePanelFooter}>
          <NavLink to="/cart" onClick={closePanel} className={styles.panelLink}>
            <FaShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className={styles.panelCartCount}>{cartItems.length}</span>
            )}
          </NavLink>
          {user ? (
            <button
              onClick={() => {
                logout();
                closePanel();
              }}
              className={styles.logoutButton}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closePanel}
              className={({ isActive }) =>
                isActive ? styles.sideLinkActive : styles.sideLink
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
}
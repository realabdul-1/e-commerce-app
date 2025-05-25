// src/pages/Checkout.jsx
import React, { useState } from "react";
import styles from "../styles/Checkout.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import cashIcon from "../assets/icons/cash.png";
import cardIcon from "../assets/icons/card.png";
import paypalIcon from "../assets/icons/paypal.png";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';


export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("Cash");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  

  if (!cartItems.length) {
    return <p className={styles.center}>Your cart is empty.</p>;
  }

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Order placed with ${payment}. Ship to: ${firstName} ${lastName}, ${address1}, ${address2 ? address2 + ', ' : ''}${city}, ${state}, ${zip}, ${country}`);
    clearCart();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h2>Checkout</h2>
      <div className={styles.cartItems}>
        {cartItems.map(item=>(
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image_url} alt={item.name} className={styles.cartImage} />
            <div className={styles.cartDetails}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={e=>updateQuantity(item.id, Number(e.target.value))}
                className={styles.qtyInput}
              />
              <button onClick={()=>removeFromCart(item.id)} className={styles.removeBtn}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Shipping Address</h3>
        <div className={styles.grid}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>

        <PhoneInput
          international
          defaultCountry="US"
          value={phone}
          onChange={setPhone}
          required
          className={styles.phoneInput}
        />

        <input
          type="text"
          placeholder="Address Line 1"
          value={address1}
          onChange={e => setAddress1(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address Line 2 (optional)"
          value={address2}
          onChange={e => setAddress2(e.target.value)}
        />
        <div className={styles.grid}>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="State / Province"
            value={state}
            onChange={e => setState(e.target.value)}
            required
          />
        </div>
        <div className={styles.grid}>
          <input
            type="text"
            placeholder="ZIP / Postal Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
            required
          />
          <select value={country} onChange={e => setCountry(e.target.value)} required>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>France</option>
            <option>Saudi Arabia</option>
            <option>UAE</option>
            <option>India</option>
            <option>Other</option>
          </select>
        </div>

        <h3>Payment Method</h3>
        <div className={styles.paymentOptions}>
          <label>
            <input
              type="radio"
              name="payment"
              value="Cash"
              checked={payment==="Cash"}
              onChange={e=>setPayment(e.target.value)}
            />
            <img src={cashIcon} alt="Cash" className={styles.icon} /> Cash
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={payment==="Card"}
              onChange={e=>setPayment(e.target.value)}
            />
            <img src={cardIcon} alt="Card" className={styles.icon} /> Credit / Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="PayPal"
              checked={payment==="PayPal"}
              onChange={e=>setPayment(e.target.value)}
            />
            <img src={paypalIcon} alt="PayPal" className={styles.icon} /> PayPal
          </label>
        </div>

        <div className={styles.total}>Total: ${getCartTotal().toFixed(2)}</div>
        <button type="submit" className={styles.submitBtn}>Place Order</button>
      </form>
    </div>
  );
}

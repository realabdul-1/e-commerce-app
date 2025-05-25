import React from "react";
import styles from "../styles/Contact.module.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.heading}>Contact Us</h1>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.row}>
            <div className={styles.inputGroup}>
            <label>Name</label>
            <input type="text" placeholder="Your Name" required />
            </div>
            <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="Your Email" required />
            </div>
        </div>
        <div className={styles.inputGroup}>
            <label>Message</label>
            <textarea placeholder="Your Message" rows="5" required></textarea>
        </div>
        <button className={styles.submitBtn}>Send Message</button>
        </form>


      <div className={styles.contactInfo}>
        <h2>Get in Touch</h2>
        <div className={styles.infoItem}>
          <FaPhoneAlt className={styles.icon} />
          <span>+1 (234) 567-8901</span>
        </div>
        <div className={styles.infoItem}>
          <FaEnvelope className={styles.icon} />
          <span>contact@yourdomain.com</span>
        </div>
        <div className={styles.infoItem}>
          <FaMapMarkerAlt className={styles.icon} />
          <span>123 Modern St, New York, NY</span>
        </div>
      </div>
    </div>
  );
}

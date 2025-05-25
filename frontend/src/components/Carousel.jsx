import React, { useState, useEffect } from "react";
import styles from "../styles/Carousel.module.css";
import banner1 from "../assets/carousel/banner1.png";
import banner2 from "../assets/carousel/banner2.png";
import banner3 from "../assets/carousel/banner3.png";

const images = [banner1, banner2, banner3];

function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carousel}>
      <img src={images[current]} alt="carousel" className={styles.image} />
    </div>
  );
}

export default Carousel;

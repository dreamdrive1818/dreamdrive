import React, { useState } from "react";
import "./Hero.css";
import VectorGroup from "../Vector/VectorGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import HeroCategories from "./HeroCategories";

const productData = [
  {
    title: "ROYAL KURTA SET",
    description: "A classic silk kurta with churidar that blends tradition and royalty. Featuring fine embroidery and a graceful silhouette, this ensemble is perfect for festive gatherings, cultural events, and grand wedding celebrations.",
    imageText: "https://static.wixstatic.com/media/fef19b_f6e311acea8c43868064cb720157628e~mv2.png/v1/crop/x_2,y_0,w_1998,h_2613/fill/w_560,h_732,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/fef19b_f6e311acea8c43868064cb720157628e~mv2.png",
  },
  {
    title: "ELEGANT SAREE",
    description: "This handwoven Kanjivaram silk saree embodies grace and timeless tradition. Accented with jacquard work and rich mustard tones, it's the perfect drape for festivals, weddings, and evening rituals where elegance meets culture.",
    imageText: "https://gunjfashion.com/cdn/shop/files/sophisticated-kanjivaram-silk-elegant-saree-with-jacquard-work-in-mustard_1.jpg?v=1712574180",
  },
  {
    title: "FESTIVE SHERWANI",
    description: "Crafted for the modern groom, this sherwani features intricate embroidery and a luxurious silhouette. Complete with a matching stole, it's the ideal choice for engagement ceremonies, sangeets, and regal receptions.",
    imageText: "https://www.tasva.com/cdn/shop/articles/MicrosoftTeams-image_13.jpg?v=1668154515&width=2048",
  },
];


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % productData.length);
    setQuantity(1); // reset quantity on slide change
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + productData.length) % productData.length);
    setQuantity(1);
  };

  const increase = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrease = () => setQuantity((q) => Math.max(q - 1, 1));

  const { title, description, imageText } = productData[currentIndex];

  return (
    <>
    <section className="hero-matoa-section">
     <VectorGroup />
      <div className="hero-matoa-container">
        {/* Left: Photo */}
        <div className="hero-photo-box">
        <img className="photo-placeholder" src={imageText} alt={title} />

        </div>

        {/* Right: Details */}
        <div className="hero-details-box">
          <h1 className="hero-title">{title}</h1>
          <hr className="hero-divider" />
          <p className="hero-description">{description}</p>
          <a href="#" className="hero-discover-link"><span>Discover Now</span></a>

          <div className="hero-action-row">
            <div className="quantity-selector">
              <button onClick={decrease}>−</button>
              <span>{quantity.toString().padStart(2, '0')}</span>
              <button onClick={increase}>+</button>
            </div>

            <button className="cta-btn add-to-cart">
              <FontAwesomeIcon icon={faCartArrowDown} />Add to cart
            </button>
            {/* <button className="cta-btn cicil-btn">cicil</button> */}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <div className="hero-arrows">
        <button className="arrow-btn outline" onClick={prevSlide}>←</button>
        <button className="arrow-btn filled" onClick={nextSlide}>→</button>
      </div>
    </section>
    <HeroCategories />
    </>
  );
};

export default Hero;

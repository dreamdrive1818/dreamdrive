import React, { useState } from 'react';
import './Collectionsection.css';

const collections = [
  {
    label: 'SALE',
    title: 'Mens Ethnic',
    image: 'https://5.imimg.com/data5/ANDROID/Default/2023/9/344693043/VL/AL/QP/36385897/product-jpeg.jpg', // Replace with yours
  },
  {
    label: '',
    title: 'Women Ethnic',
    image: 'https://kalistastudio.in/cdn/shop/files/LH-98_1_1.jpg?format=pjpg&v=1738658464&width=1100',
  },
  {
    label: 'SALE',
    title: 'Kid Ethnic',
    image: 'https://www.fayonkids.com/cdn/shop/products/fayon-kids-red-bandhej-kurta-off-white-salwar-for-boys-37173292630272.jpg?v=1655208174&width=533',
  },
  {
    label: '',
    title: 'Sherwanis',
    image: 'https://www.sudarshansaree.com/cdn/shop/products/ETW1520-1027.jpg?v=1670073067',
  },
  {
    label: '',
    title: 'Ethnic Footwear',
    image: 'https://inc5shop.com/cdn/shop/products/600793_GOLD.jpg?v=1744101241&width=533',
  },
  {
    label: '',
    title: 'Accessories',
    image: 'https://i.etsystatic.com/41722900/r/il/c7ed2a/5329568909/il_570xN.5329568909_pesp.jpg',
  }
  
  
];

const CollectionSection = () => {

    const [showDiscover, setShowDiscover] = useState(false);

  return (
    <section className="collection-section">
     <div className="collection-div">
        <div className="collection-left">
            <div className="deal-title-wrapper">
              <h2 className="deal-title">Our Collection</h2>
           </div>
           <div className="ethnic-highlight">
  <p className="ethnic-subheading">Our Curated Picks</p>
  <h3 className="ethnic-heading">
    Where Heritage<br />
    Meets Modern Style
  </h3>
  <p className="ethnic-description">
    Explore a thoughtfully curated ethnic collection—perfect for celebrations, rituals, or just owning your everyday elegance.
  </p>
  <button className="ethnic-button">Explore Collection</button>
</div>

      </div>
      <div className="collection-grid">
        {collections.map((item, idx) => (
          <div key={idx} className="collection-card"   onMouseEnter={() => setShowDiscover(idx)}
          onMouseLeave={() => setShowDiscover(null)}>
            {item.label && <span className="label">{item.label}</span>}
            <img src={item.image} alt={item.title} className="collection-image" />
            <h3 className="collection-name">{item.title}</h3>
            <div className="collection-btn">
            <a  className={showDiscover === idx ? 'discover-btn discover-btn-show' : 'discover-btn'}>Discover Now</a>
          </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default CollectionSection;

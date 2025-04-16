import React from 'react';
import './DealSection.css';

const formatINR = (num) => {
  return `₹${num.toLocaleString('en-IN')}`;
};

const staticProducts = [
  {
    name: 'Men’s Kurta Set – Silk Blend',
    originalPrice: 5200,
    discountPercent: 25,
    image: 'https://staticm247.kalkifashion.com/media/catalog/product/p/e/peach_cotton_silk_kurta_set_for_men-sg209446_1_.jpg',
  },
  {
    name: 'Women’s Saree – Banarasi Silk',
    originalPrice: 3200,
    discountPercent: 30,
    image: 'https://m.media-amazon.com/images/I/81JXgwHL51L._AC_UY1100_.jpg',
  },
  {
    name: 'Kids Ethnic Set – Kurta Pyjama',
    originalPrice: 1400,
    discountPercent: 15,
    image: 'https://assets.panashindia.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/3/2/325kw04-6188.jpg',
  },
  {
    name: 'Men’s Nehru Jacket',
    originalPrice: 1800,
    discountPercent: 20,
    image: 'https://colorweave.in/cdn/shop/products/nordlich-colorweave-kalamkari-black-motifs-mens-nehru-jacket-01_1080x1080.jpg?v=1677915303',
  },
];

const DealSection = () => {
  return (
    <section className="deal-section">
        <div className="deal-title-wrapper">
    <h2 className="deal-title">Monthly Deals</h2>
  </div>
      <div className="deal-grid">
        {staticProducts.map((product, index) => {
          const discountPrice = Math.floor(
            product.originalPrice * (1 - product.discountPercent / 100)
          );
          return (
            <div key={index} className="deal-card">
              <img
                src={product.image}
                alt={product.name}
                className="deal-image"
              />
              <div className="deal-info">
                <h3 className="deal-name">{product.name}</h3>
                <p className="deal-discount">{product.discountPercent}% Off</p>
                <p className="deal-original">{formatINR(product.originalPrice)}</p>
                <p className="deal-price">{formatINR(discountPrice)}</p>
                <button className="deal-button">Add to cart</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="explore-more-wrapper">
    <button className="explore-more-button">Explore More  ↗</button>
  </div>
    </section>
  );
};

export default DealSection;

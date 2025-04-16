import React from 'react';
import './TopSeller.css'; // Link to the pure CSS file

const topSellers = {
    Men: [
      { name: 'Silk Kurta Set', price: 3299, img: 'https://riyaasat.in/cdn/shop/files/RIYA1123146_3.jpg?v=1741777652' },
      { name: 'Pathani Suit', price: 2499, img: 'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/s/o/solid-color-poly-cotton-paithani-suit-in-black-v1-mtr3062.jpg' },
      { name: 'Sherwani with Dupatta', price: 5499, img: 'https://img.perniaspopupshop.com/catalog/product/z/o/ZOOP102455_1.jpg?impolicy=detailimageprod' },
    ],
    Women: [
      { name: 'Banarasi Saree', price: 4599, img: 'https://silkfolks.com/cdn/shop/files/KPR-190-Red_1.jpg?v=1715152596' },
      { name: 'Anarkali Suit', price: 3199, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ag4RUPO5PPaa_AYLpSkZyWZAWVR5zWFlEg&s' },
      { name: 'Lehenga Choli', price: 5999, img: 'https://www.anantexports.in/cdn/shop/files/IMG-20240403_173334.jpg?v=1712146061&width=1946' },
    ],
    Children: [
      { name: 'Boys Kurta Pajama', price: 1199, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDMuwGQi_F2pKVrtsbiVa7bbGi9Op-c6WGow&s' },
      { name: 'Girls Lehenga Set', price: 1899, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR27jxDQEeXa0HoXKfhcSXTTXpQ3U02JgqDfA&s' },
      { name: 'Boys Sherwani Set', price: 2399, img: 'https://www.jiomart.com/images/product/original/rvylgwqkr1/ahhaaaa-kids-ethnic-silk-blend-zari-work-indo-western-sherwani-set-for-boys-product-images-rvylgwqkr1-0-202308120454.jpg?im=Resize=(500,630)' },
    ],
  };
  
  const formatINR = (num) => {
    return `₹${num.toLocaleString('en-IN')}`;
  };

const TopSeller = () => {
  return (
    <div className="top-seller-section">
        <div className="top-seller-top">
       
        <div className="top-seller-left">
        <div className="deal-title-wrapper">
            <h2 className="deal-title">Top Seller</h2>
          </div>
          <div className="ethnic-highlight">
  <p className="ethnic-subheading">Celebrate Culture</p>
  <h3 className="ethnic-heading">
    Traditional Meets<br />
    Trendy Elegance
  </h3>
  <p className="ethnic-description">
    Handpicked styles for weddings, festivals, and daily grace.
  </p>
  <button className="ethnic-button">Shop Collection</button>
</div>

        </div>
        <div className="top-seller-right">
            <div className="top-seller-grid">
      {Object.entries(topSellers).map(([category, products]) => {
        const minPrice = Math.min(...products.map(p => p.price));
        return (
          <div className="category" key={category}>
            <h2>{category} Top Seller</h2>
            <p className="starting-price">Starting from {formatINR(minPrice)}</p>
            {products.map((product, index) => (
              <div className="product" key={index}>
                <div className="product-img">
                <img src={product.img} alt={product.name} />
                </div>
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">{formatINR(product.price)}</div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      </div>
        <div className="see-more-container">
        <button className="see-more-btn">See More</button>
      </div>
           </div>
                
        </div>
    </div>
  );
};

export default TopSeller;

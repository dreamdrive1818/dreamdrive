import React from 'react'
import './HeroCategories.css'

const HeroCategories = () => {
  const categories = [
    {
      title: "Men's Ethnic",
      subtitle: "Explore traditional styles that blend culture with class.",
      cta: "Discover Now",
      imageText: "https://www.tasva.com/cdn/shop/articles/Untitled_design_5bd745bf-971c-4334-981f-4f2e44533898.png?v=1728024330&width=2048"
    },
    {
      title: "Women's Ethnic",
      subtitle: "Unveil elegance in timeless ethnic fashion and grace.",
      cta: "Discover Now",
      imageText: "https://media.vogue.in/wp-content/uploads/2021/10/lashkaraafeatured-1366x768.jpg"
    }
  ];

  return (
    <div className="hero-categories-section">
      {categories.map((cat, index) => (
        <div key={index} className="hero-category-card">
          <div className="hero-category-text">
            <h3 className='h3head'>{cat.title}</h3>
            <p className='para'>{cat.subtitle}</p>
            <a href="#" className='para discover-btn'>{cat.cta}</a>
          </div>
          <div className="hero-category-image">
            <img src={cat.imageText} alt={cat.imageText} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroCategories;

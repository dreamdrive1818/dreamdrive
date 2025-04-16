import React, { useState } from 'react';
import './Testimonial.css';
import VectorGroup from '../Vector/VectorGroup';

const testimonials = [
    {
      name: 'Gita Savitri',
      role: 'Content Creator/Influencer',
      text: `Absolutely loved this Silk Kurta Set from Riyaasat! The fabric feels premium and the traditional design adds a graceful charm. I wore it to a wedding and received so many compliments on the rich look and comfort. It blends elegance with tradition so effortlessly. The subtle embroidery and soft texture make it perfect for long celebrations without feeling heavy.`,
      img: 'https://riyaasat.in/cdn/shop/files/RIYA1123146_3.jpg?v=1741777652',
    },
    {
      name: 'Rahul Verma',
      role: 'Fashion Blogger',
      text: `This red Banarasi ethnic set is a head-turner! The zari work is absolutely stunning and catches the light beautifully. It's incredibly comfortable to wear despite its regal appearance. I featured it in my festive shoot, and the audience loved the heritage vibe. Perfect for Diwali, weddings, or any cultural celebration where you want to stand out with class and tradition.`,
      img: 'https://silkfolks.com/cdn/shop/files/KPR-190-Red_1.jpg?v=1715152596',
    },
    {
      name: 'Siti Aisyah',
      role: 'Entrepreneur',
      text: `Bought this sherwani set for my son and it exceeded expectations in every way. The color is vibrant, the fit is just right, and the intricate ethnic detailing really gives it a luxurious feel. He wore it for our family function and looked absolutely adorable! It's rare to find kids’ ethnic wear that combines style, comfort, and quality like this.`,
      img: 'https://www.jiomart.com/images/product/original/rvylgwqkr1/ahhaaaa-kids-ethnic-silk-blend-zari-work-indo-western-sherwani-set-for-boys-product-images-rvylgwqkr1-0-202308120454.jpg?im=Resize=(500,630)',
    },
  ];
  

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  const prevTestimonial = () =>
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const nextTestimonial = () =>
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  const { name, role, text, img } = testimonials[current];

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-left">
        <div className="testimonial-top">
           <div className="testimonial-image-wrapper">
             <div className="bg-abstract"></div>
             <img src={img} alt={name} className="testimonial-image" />
           </div>
        </div>
        <div className="testimonial-nav">
        <span className="nav-arrow testimonial-nav-arrow-left" onClick={prevTestimonial}>
          ←
        </span>
        <span className="nav-arrow testimonial-nav-arrow-right" onClick={nextTestimonial}>
          →
        </span>
      </div>
        </div>
        <div className="testimonial-content">
          <h2 className="testimonial-title">Testimonials</h2>
          <p className="testimonial-text">{text}</p>
          <p className="testimonial-author">{name}</p>
          <p className="testimonial-role">{role}</p>
        </div>
      </div>
      <VectorGroup />
    </section>
  );
};

export default Testimonial;

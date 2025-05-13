import React, { useState } from "react";
import "./Order.css";
import HowItWorks from "../HowItWorks/HowItWorks";
import OrderModal from "./OrderModal/OrderModal";
import { useOrderContext } from "../../context/OrderContext";

const Order = () => {
  const { selectedCar } = useOrderContext();
  const car = selectedCar;
  const [showModal, setShowModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  if (!car) {
    return <div className="order-error">No car selected.</div>;
  }

  const handlePrev = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? (car.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCarouselIndex((prev) =>
      (prev + 1) % (car.images?.length || 1)
    );
  };

  const handleThumbClick = (index) => {
    setCarouselIndex(index);
  };

  return (
    <>
      <div className="order-container">
        <h2 className="order-heading">Review Your Selection</h2>
        <div className="order-card">
          <div className="order-img">
            <div className="carousel-container">
              <button className="arrow left" onClick={handlePrev}>
                &#8249;
              </button>
              <img
                src={car.images?.[carouselIndex] || car.image}
                alt="Selected Car"
                className="carousel-image"
              />
              <button className="arrow right" onClick={handleNext}>
                &#8250;
              </button>
            </div>
            <div className="thumbnails">
              {car.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  className={`thumb ${carouselIndex === index ? "active" : ""}`}
                  onClick={() => handleThumbClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="order-details">
            <h3>{car.name}</h3>
            <ul className="order-specs">
              <li><strong>Type:</strong> {car.details.type}</li>
              <li><strong>Price:</strong> {car.price}</li>
              <li><strong>Seats:</strong> {car.details.seats}</li>
              <li><strong>Luggage:</strong> {car.details.luggage} bags</li>
              <li><strong>Fuel:</strong> {car.details.fuel}</li>
              <li><strong>Transmission:</strong> {car.details.mt === "YES" ? "Manual" : "Automatic"}</li>
              <li><strong>Free Kilometer Limit:</strong> {car.details.kilometer}</li>
              <li><strong>Extra Km Charges:</strong> ₹{car.details.extraKm}</li>
              <li><strong>Extra Hour Charges:</strong> ₹{car.details.extraHr}</li>
            </ul>

            <button className="order-book-btn" onClick={() => setShowModal(true)}>
              Proceed to Booking
            </button>
          </div>
        </div>
      </div>
      {showModal && <OrderModal closeModal={() => setShowModal(false)} />}
      {/* <HowItWorks /> */}
    </>
  );
};

export default Order;

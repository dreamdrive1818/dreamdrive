import React, { useState } from "react";
import "./Order.css";
import HowItWorks from "../HowItWorks/HowItWorks";
import OrderModal from "./OrderModal/OrderModal";
import { useOrderContext } from "../../context/OrderContext";

const Order = () => {
  const { selectedCar } = useOrderContext();
  const car = selectedCar;
  const [showModal, setShowModal] = useState(false);

  if (!car) {
    return <div className="order-error">No car selected.</div>;
  }

  return (
    <>
    <div className="order-container">
      <h2 className="order-heading">Review Your Selection</h2>
      <div className="order-card">
        <div className="order-img">
          <img src={car.image} alt={car.name} />
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
    <HowItWorks />
    </>
  );
};

export default Order;

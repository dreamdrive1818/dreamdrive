import React from "react";
import "./Payment.css";
import { toast } from "react-toastify";

const Payment = () => {
  const handlePayment = () => {
    toast.success("Proceeding to pay ₹1500");
    // Payment gateway integration logic here
  };

  return (
    <section className="payment-section">
      <div className="payment-banner">
        <div className="payment-content">
          <h1 className="payment-heading">Confirm Your Ride Now</h1>
          <p className="payment-description">
            Lock in your booking with an advance of <strong>₹1500</strong>. Enjoy peace of mind
            with full support and guaranteed service.
          </p>

          <ul className="payment-benefits">
            <li>✔ Instant Booking Confirmation</li>
            <li>✔ Insurance Coverage</li>
            <li>✔ Priority Support</li>
            <li>✔ Flexible Pickup Options</li>
          </ul>

          <button className="pay-now-btn" onClick={handlePayment}>
            Pay ₹1500 & Confirm Booking
          </button>

          <p className="payment-disclaimer">
            🔒 100% secure & refundable if cancelled 24hrs before pickup.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Payment;

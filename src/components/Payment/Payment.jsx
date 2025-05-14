import React, { useEffect, useState } from "react";
import "./Payment.css";
import { toast } from "react-toastify";
import { useOrderContext } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { order, submitOrderToFirestore } = useOrderContext();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!order || !order.car) {
      toast.warning("No order found. Please select a car first.");
      navigate("/cars");
    }
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    await submitOrderToFirestore(navigate);
    setProcessing(false);
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

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay ₹1500 & Confirm Booking"}
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

import React, { useEffect, useRef } from "react";
import "./Success.css";
import { useOrderContext } from "../../../context/OrderContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaCarAlt,
  FaUserAlt,
  FaMoneyBillWave,
  FaArrowRight,
} from "react-icons/fa";

const Success = () => {
  const { order, user, clearOrder } = useOrderContext();
  const navigate = useNavigate();
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  // Detect navigation AWAY from /success
  useEffect(() => {
    const handleClear = () => {
      if (previousPath.current === "/success" && location.pathname !== "/success") {
        clearOrder();
      }
      previousPath.current = location.pathname;
    };

    handleClear();
  }, [location.pathname, clearOrder]);

  if (!order || !user) {
    return (
      <div className="success-wrapper">
        <div className="success-card error">
          <h2>Order Not Found</h2>
          <p>Your booking details are unavailable. Please try again.</p>
          <button onClick={() => navigate("/cars")}>Back to Cars</button>
        </div>
      </div>
    );
  }

  const { car, advancePaid } = order;

  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>Your ride has been successfully scheduled.</p>
          <div className="order-id-box">
  <p><strong>Ride ID:</strong> {order.id}</p>
</div>
        </div>

        <div className="success-grid">
          <div className="success-section">
            <h4><FaCarAlt /> Car Details</h4>
            <ul>
              <li><strong>Name:</strong> {car.name}</li>
              <li><strong>Type:</strong> {car.details.type}</li>
              <li><strong>Seats:</strong> {car.details.seats}</li>
              <li><strong>Fuel:</strong> {car.details.fuel}</li>
              <li><strong>Transmission:</strong> {car.details.mt === "YES" ? "Manual" : "Automatic"}</li>
            </ul>
          </div>

          <div className="success-section">
            <h4><FaUserAlt /> User Info</h4>
            <ul>
              <li><strong>Name:</strong> {user.fullName}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Phone:</strong> {user.phone}</li>
            </ul>
          </div>

          <div className="success-section">
            <h4><FaMoneyBillWave /> Payment Summary</h4>
            <ul>
              <li><strong>Advance Paid:</strong> ₹{advancePaid}</li>
              <li><strong>Status:</strong> Confirmation</li>
              <li><strong>Date:</strong> {new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>

        <p className="success-followup">
          A confirmation email will be sent shortly. For any questions, feel free to chat with our support team via the live chat option.
        </p>

        <button className="go-home" onClick={() => navigate("/")}>
          Go to Home <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Success;

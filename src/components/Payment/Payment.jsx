import React, { useEffect } from "react";
import "./Payment.css";
import { toast } from "react-toastify";
import { useOrderContext } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const Payment = () => {
  const { order, clearOrder, user } = useOrderContext();
  const navigate = useNavigate();

 
  useEffect(()=>{
       if (!order || !order.car) {
      toast.warning("No order found. Please select a car first.");
      navigate("/cars");
    }
  },[])
  

  const handlePayment = async () => {
    if (!order || !user) return;
   
    try {      
      const orderWithPayment = {
        ...order,
        advancePaid: 1500,
        paymentStatus: "paid",
        createdAt: Timestamp.now(),
      };

      // 1. Save order globally
      await addDoc(collection(db, "orders"), orderWithPayment);

      // 2. Add to user's document
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        orders: arrayUnion(orderWithPayment),
      });

      toast.success("Advance payment of ₹1500 saved. Order confirmed!");
      navigate("/success"); // Or any confirmation page
    } catch (error) {
      console.error("Order save failed:", error);
      toast.error("Failed to save order. Please try again.");
    }
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

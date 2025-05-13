import React, { useState } from "react";
import "./OrderModal.css";
import { db } from "../../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../../context/OrderContext";
import axios from "axios";



const OrderModal = ({ closeModal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
const [isSendingOtp, setIsSendingOtp] = useState(false);

  const navigate = useNavigate();
  const { setUser, createPendingOrder, handleOrder } = useOrderContext();

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) setPhone(val);
  };


const handleSendOtp = async () => {
  if (!fullName || !email || !phone) return toast.error("All fields are required.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email format.");
  if (!/^\d{10}$/.test(phone)) return toast.error("Enter a valid 10-digit phone number.");
  if (!agreed) return toast.warn("Please agree to the Terms & Conditions.");

  setIsChecking(true);

  const userId = email;
  const userRef = doc(db, "users", userId);
  const userData = {
    uid: userId,
    fullName,
    email,
    phone: "+91" + phone,
    createdAt: new Date(),
  };

  try {
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      toast.info("User already exists. Skipping OTP.");
      setUser(userData);
      createPendingOrder(userData);
      closeModal();
      navigate("/payment");
    } else {
      setIsChecking(false); 
      setIsSendingOtp(true);

      const res = await axios.post("https://dreamdrive-1maq.onrender.com/send-otp", { email });

      if (res.status === 200) {
        toast.success("OTP sent to your email.");
        setOtpSent(true);
        await setDoc(userRef, userData);
        setUser(userData);
      } else {
        toast.error(res.data?.message || "Failed to send OTP.");
      }
    }
  } catch (err) {
    console.error("Send OTP Error:", err.message);
    toast.error(err.response?.data?.message || "Something went wrong while sending OTP.");
  } finally {
    setIsChecking(false);
    setIsSendingOtp(false);
  }
};



  // ✅ Verify OTP and then save local order
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP.");

    try {
      const res = await axios.post("https://dreamdrive-1maq.onrender.com/verify-otp", {
        email,
        otp,
      });

      if (res.data.verified) {
        const userData = {
          uid: email,
          fullName,
          email,
          phone: "+91" + phone,
          createdAt: new Date(),
        };

        setUser(userData);
        createPendingOrder(userData);
        closeModal();
        navigate("/payment");
      } else {
        toast.error(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.message);
      toast.error(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    }
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>
        <h3>Secure Your Booking</h3>
        <p>Verify your email address to proceed to payment.</p>

        {!otpSent ? (
          <>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">+91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
              />
            </div>

            <div className="terms-check">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="/termsandconditions" target="_blank" rel="noreferrer">
                  Terms & Conditions
                </a>
                .
              </label>
            </div>

            <button
  onClick={handleSendOtp}
  disabled={isChecking || isSendingOtp}
>
  {isChecking
    ? "Checking..."
    : isSendingOtp
    ? "Sending OTP..."
    : "Send OTP"}
</button>
          </>
        ) : (
          <>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify & Continue</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderModal;

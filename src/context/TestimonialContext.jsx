import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const TestimonialContext = createContext();

export const useTestimonialContext = () => useContext(TestimonialContext);

export const TestimonialProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      const approved = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.status === "approved");
      setTestimonials(approved);
    });
    return () => unsub();
  }, []);

  const submitTestimonial = async (testimonialData) => {
    try {
      await addDoc(collection(db, "testimonials"), {
        ...testimonialData,
        status: "pending", 
        createdAt: Timestamp.now(),
      });
      toast.success("Thank you for your feedback! Your testimonial is pending review.");
    } catch (error) {
      console.error("Submit Testimonial Error:", error.message);
      toast.error("Failed to submit testimonial, please try again later.");
    }
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, submitTestimonial }}>
      {children}
    </TestimonialContext.Provider>
  );
};

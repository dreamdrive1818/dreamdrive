import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(() => {
    const order = localStorage.getItem("order");
    return order ? JSON.parse(order) : null;
  });

  const [selectedCar, setSelectedCar] = useState(() =>
    localStorage.getItem("selectedCar") ? JSON.parse(localStorage.getItem("selectedCar")) : null
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("selectedCar", JSON.stringify(selectedCar));
  }, [selectedCar]);

  useEffect(() => {
    if (order) {
      localStorage.setItem("order", JSON.stringify(order));
    } else {
      localStorage.removeItem("order");
    }
  }, [order]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleOrder = (car) => {
  setSelectedCar(car);
};


  
  const createPendingOrder = (userData) => {
    if (!selectedCar) {
      toast.warn("No car selected — order not saved.");
      return;
    }

    const bookingData = {
      user: userData,
      car: selectedCar,
      status: "pending",
      createdAt: new Date(),
    };

    setOrder(bookingData);
    console.log("Booking Details saved locally-->",bookingData);
    toast.success("Order saved locally. Proceed to payment.");
  };

  const clearOrder = () => {
  setOrder(null);
  toast.info("Order cleared from local storage.");
};



  const submitOrderToFirestore = async (navigate, closeModal) => {
    if (!order) {
      toast.error("No order found to submit.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), order);
      toast.success("Order submitted to Firestore!");
      if (closeModal) closeModal();
      if (navigate) navigate("/payment");
    } catch (err) {
      console.error("Order Save Error:", err.message);
      toast.error("Failed to submit order to Firestore.");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        user,
        setUser,
        selectedCar,
        setSelectedCar,
        createPendingOrder,   
        submitOrderToFirestore, 
        handleOrder,
        clearOrder 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);

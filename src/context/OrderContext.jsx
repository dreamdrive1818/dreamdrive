import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import axios from "axios";

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
  };

  const clearOrder = () => {
  setOrder(null);
};



const submitOrderToFirestore = async (navigate) => {
  if (!order) {
    toast.error("No order found to submit.");
    return;
  }

  const customId = `RIDE${Math.floor(100000 + Math.random() * 900000)}`;

  const orderWithCustomId = {
    ...order,
    id: customId,
    advancePaid: 1500,
    paymentStatus: "paid",
    createdAt: new Date(),
  };

  try {
    await addDoc(collection(db, "orders",orderWithCustomId.id), orderWithCustomId);
    setOrder(orderWithCustomId);

    const userRef = doc(db, "users", user.email);
    await updateDoc(userRef, {
      orders: arrayUnion(orderWithCustomId),
    });

   
    await axios.post("https://dreamdrive-1maq.onrender.com/send-confirmation", {
      user,
      order: orderWithCustomId,
    });

    toast.success("Advance payment of ₹1500 saved. Order confirmed!");

    
    if (navigate) navigate("/success");

  } catch (err) {
    console.error("Order Save Error:", err.message);
    toast.error("Failed to complete order. Please try again.");
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

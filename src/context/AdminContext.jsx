import { createContext, useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") || null
  );

  // 🔐 Admin Login with Role Check
  const AdminLogin = async (email, password, navigate) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const adminRef = doc(db, "admin", uid);
      const adminDoc = await getDoc(adminRef);

      if (!adminDoc.exists() || adminDoc.data().role !== "all") {
        throw new Error("Access denied");
      }

      toast.success("Login successful");
      setAdmin(email);
      localStorage.setItem("admin", email);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err.message);
      toast.error(err.message);
      throw err; // So the component can optionally catch it
    }
  };

  // 🚗 Get all cars
  const fetchCars = async () => {
    const snapshot = await getDocs(collection(db, "cars"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // ➕ Add a car
  const addCar = async (carData) => {
    await addDoc(collection(db, "cars"), carData);
  };

  // 📝 Update car
  const updateCar = async (carId, carData) => {
    await updateDoc(doc(db, "cars", carId), carData);
  };

  // ❌ Delete car
  const deleteCar = async (carId) => {
    await deleteDoc(doc(db, "cars", carId));
  };

// fetch rides
   const fetchRides = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // 📝 Update Ride Status
  const updateRideStatus = async (rideId, newStatus) => {
    await updateDoc(doc(db, "orders", rideId), {
      status: newStatus,
    });
    toast.success("Ride status updated");
  };

  // 🧾 Update Payment Status
  const updatePaymentStatus = async (rideId, paymentStatus) => {
    await updateDoc(doc(db, "orders", rideId), {
      paymentStatus,
    });
    toast.success("Payment status updated");
  };

  // ❌ Delete Ride
  const deleteRide = async (rideId) => {
    await deleteDoc(doc(db, "orders", rideId));
    toast.success("Ride deleted successfully");
  };

  return (
    <AdminContext.Provider
    value={{
        admin,
        setAdmin,
        AdminLogin,
        fetchCars,
        addCar,
        updateCar,
        deleteCar,
        fetchRides,
        updateRideStatus,
        updatePaymentStatus,
        deleteRide,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);

import { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  collectionGroup,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion
} from "firebase/firestore";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    localStorage.getItem("admin") || null
  );

   const [allComments, setAllComments] = useState([]);
     const [selectedBlog, setSelectedBlog] = useState(null);
     const selectBlog = (blog) => setSelectedBlog(blog);

  // 🔐 Admin Login with Role Check
  useEffect(() => {
    const verifyAdminFromStorage = async () => {
      const storedUID = localStorage.getItem("admin_uid");
      if (!storedUID) return;

      try {
        const adminRef = doc(db, "admin", storedUID);
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists() && adminDoc.data().role === "all") {
          setAdmin(adminDoc.data().email);
        } else {
          localStorage.removeItem("admin_uid");
          setAdmin(null);
        }
      } catch (error) {
        console.error("Failed to verify admin:", error);
        localStorage.removeItem("admin_uid");
        setAdmin(null);
      }
    };

    verifyAdminFromStorage();
  }, []);

  // 🔐 Admin Auth
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
      localStorage.setItem("admin_uid", uid);
      setAdmin(email);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err.message);
      toast.error(err.message);
      throw err;
    }
  };

  const AdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin_uid");
    toast.success("Logged out successfully");
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
  const rideRef = doc(db, "orders", rideId);
  const rideSnap = await getDoc(rideRef);

  if (!rideSnap.exists()) {
    toast.error("Ride not found.");
    return;
  }

  const rideData = rideSnap.data();
  const updatedRide = {
    ...rideData,
    status: newStatus,
  };

  const userRef = doc(db, "users", rideData.user.email);

  try {
    // Step 1: Update order document
    await updateDoc(rideRef, { status: newStatus });

    // Step 2: Update orders array in user document
    await updateDoc(userRef, {
      orders: arrayRemove(rideData),
    });
    await updateDoc(userRef, {
      orders: arrayUnion(updatedRide),
    });

    toast.success("Ride status updated");
  } catch (err) {
    console.error("Ride status update error:", err.message);
    toast.error("Failed to update ride status");
  }
};

async function updateBookingDateTime(rideId, bookingDate, bookingTime) {
  try {
    await updateDoc(doc(db, "orders", rideId), {
      bookingDate,
      bookingTime,
    });
    toast.success("Booking date & time updated");
  } catch (error) {
    console.error("Error updating booking date/time:", error.message);
    toast.error("Failed to update booking date & time");
  }
}

async function updateRentalType(rideId, rentalType) {
  try {
    await updateDoc(doc(db, "orders", rideId), {
      rentalType,
    });
    toast.success("Rental type updated");
  } catch (error) {
    console.error("Error updating rental type:", error.message);
    toast.error("Failed to update rental type");
  }
}




  // 🧾 Update Payment Status
const updatePaymentStatus = async (rideId, paymentStatus) => {
  const rideRef = doc(db, "orders", rideId);
  const rideSnap = await getDoc(rideRef);

  if (!rideSnap.exists()) {
    toast.error("Ride not found.");
    return;
  }

  const rideData = rideSnap.data();
  const updatedRide = {
    ...rideData,
    paymentStatus,
  };

  const userRef = doc(db, "users", rideData.user.email);

  try {
    // Step 1: Update order document
    await updateDoc(rideRef, { paymentStatus });

    // Step 2: Update orders array in user document
    await updateDoc(userRef, {
      orders: arrayRemove(rideData),
    });
    await updateDoc(userRef, {
      orders: arrayUnion(updatedRide),
    });

    toast.success("Payment status updated");
  } catch (err) {
    console.error("Payment status update error:", err.message);
    toast.error("Failed to update payment status");
  }
};


  // ❌ Delete Ride
const deleteRide = async (rideId) => {
  try {
    const rideRef = doc(db, "orders", rideId);
    const rideSnap = await getDoc(rideRef);

    if (!rideSnap.exists()) {
      toast.error("Ride not found.");
      return;
    }

    const rideData = rideSnap.data();
    const userEmail = rideData.user?.email;

    if (!userEmail) {
      toast.error("User email not found in ride data.");
      return;
    }

    const userRef = doc(db, "users", userEmail);

    // Step 1: Remove this ride object from user's orders array
    await updateDoc(userRef, {
      orders: arrayRemove(rideData),
    });

    // Step 2: Delete the ride from orders collection
    await deleteDoc(rideRef);

    toast.success("Ride deleted successfully from orders and user history.");
  } catch (err) {
    console.error("Delete Ride Error:", err.message);
    toast.error("Failed to delete ride.");
  }
};

//fetch users
const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ❌ Delete a user
const deleteUser = async (userId) => {
  await deleteDoc(doc(db, "users", userId));
  toast.success("User deleted successfully");
};






// 📥 Fetch Contact Messages
const fetchMessages = async () => {
  const snapshot = await getDocs(collection(db, "contacts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 📚 Blog Management (no categories)
  const fetchBlogs = async () => {
     const snapshot = await getDocs(collection(db, '_blogs'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

 const addBlog = async (blogData) => {
  try {
    const blogRef = await addDoc(collection(db, '_blogs'), blogData);
    toast.success("Blog added successfully!");
    return blogRef.id;
  } catch (error) {
    console.error("Error adding blog:", error.message);
    throw error;
  }
};


  const deleteBlog = async (blogId) => {
    try {
      await deleteDoc(doc(db, '_blogs', blogId));
      toast.success("Blog deleted");
    } catch (error) {
      console.error("Delete error:", error.message);
      throw error;
    }
  };

  const updateBlog = async (blogId, updatedData) => {
    try {
      const ref = doc(db, '_blogs', blogId);
      await updateDoc(ref, {
        ...updatedData,
        updatedAt: new Date(),
      });
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error("Update error:", error.message);
      throw error;
    }
  };

  // 💬 Comment Management
  const fetchComments = async () => {
    try {
      const snapshot = await getDocs(collectionGroup(db, "comments"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          path: doc.ref.path,
          approved: typeof d.approved === "string" ? d.approved === "true" : !!d.approved,
        };
      });
      setAllComments(data);
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error.message);
      return [];
    }
  };

  // 📁 Category Management
  const addCategory = async (name) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    const ref = doc(db, 'categories', formattedName);
    await setDoc(ref, { name, createdAt: new Date() });
    return formattedName;
  };

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const fetchCategoryById = async (docId) => {
    try {
      const ref = doc(db, 'categories', docId);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      } else {
        throw new Error('Category not found');
      }
    } catch (err) {
      console.error('Error fetching category:', err.message);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    await deleteDoc(doc(db, 'categories', categoryId));
    toast.success("Category deleted");
  };

  const updateCategory = async (oldId, newData) => {
    let newId = oldId;

    if (typeof newData === "string") {
      newId = newData.toLowerCase().replace(/\s+/g, '-');
      const newRef = doc(db, 'categories', newId);
      const oldRef = doc(db, 'categories', oldId);
      const docSnap = await getDoc(oldRef);

      if (docSnap.exists()) {
        await setDoc(newRef, {
          ...docSnap.data(),
          name: newData,
          updatedAt: new Date(),
        });
        await deleteDoc(oldRef);
        toast.success("Category updated");
      } else {
        throw new Error("Old category not found");
      }
    } else if (typeof newData === "object") {
      const ref = doc(db, 'categories', oldId);
      await updateDoc(ref, newData);
      toast.success("SEO metadata updated");
    }
  };

  const updateCommentApproval = async (commentId, path, currentStatus) => {
    try {
      const commentRef = doc(db, path);
      await updateDoc(commentRef, {
        approved: !currentStatus,
      });

      setAllComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, approved: !currentStatus } : comment
        )
      );

      toast.success(`Comment ${!currentStatus ? "approved" : "disapproved"}`);
    } catch (err) {
      console.error("Error updating comment approval:", err.message);
      toast.error("Failed to update comment status");
    }
  };


  // fetch all testimonials
const fetchTestimonials = async () => {
  const snapshot = await getDocs(collection(db, "testimonials"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// approve testimonial
const approveTestimonial = async (id) => {
  const ref = doc(db, "testimonials", id);
  await updateDoc(ref, { status: "approved" });
};

// delete testimonial
const deleteTestimonial = async (id) => {
  const ref = doc(db, "testimonials", id);
  await deleteDoc(ref);
};


  return (
    <AdminContext.Provider
    value={{
        admin,
        setAdmin,
        AdminLogin,
         AdminLogout,
        fetchCars,
        addCar,
        updateCar,
        deleteCar,
        fetchRides,
        updateRideStatus,
        updatePaymentStatus,
        deleteRide,
         fetchUsers,    
         deleteUser,
           fetchMessages,
           fetchBlogs,
           addBlog,
           deleteBlog,
           updateBlog,
           fetchComments,
           fetchCategories,
           fetchCategoryById,
           deleteCategory,
           updateCategory,
           addCategory,
           updateRentalType,
           updateBookingDateTime,
           fetchTestimonials,
           approveTestimonial,
           deleteTestimonial
            
          //  updateCommentApproval
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);

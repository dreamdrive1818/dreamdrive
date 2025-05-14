import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../context/AdminContext";
import "./ManageRide.css"; 

const ManageRide = () => {
  const { fetchRides, updateRideStatus, updatePaymentStatus, deleteRide } = useAdminContext();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const loadRides = async () => {
      const data = await fetchRides();
      setRides(data);
    };
    loadRides();
  }, []);

  console.log("Rides-->",rides);

  return (
    <div className="manage-rides">
      <h2>Manage Rides</h2>
      {rides.length === 0 ? (
        <p>No rides available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ride ID</th>
              <th>Car</th>
              <th>User</th>
              <th>Advance</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.id}</td>
                <td>{ride.car?.name}</td>
                <td>{ride.user?.fullName} <br />{ride.user?.email}</td>
                <td>₹{ride.advancePaid}</td>
                <td>
                  <select
                    value={ride.status}
                    onChange={(e) => updateRideStatus(ride.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>
                  <select
                    value={ride.paymentStatus}
                    onChange={(e) => updatePaymentStatus(ride.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteRide(ride.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRide;

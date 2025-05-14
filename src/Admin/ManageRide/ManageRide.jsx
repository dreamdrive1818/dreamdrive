import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../context/AdminContext";
import "./ManageRide.css"; 

const ManageRide = () => {
  const { fetchRides, updateRideStatus, updatePaymentStatus, deleteRide } = useAdminContext();
  const [rides, setRides] = useState([]);

  const loadRides = async () => {
    const data = await fetchRides();
    setRides(data);
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleStatusChange = async (rideId, newStatus) => {
    await updateRideStatus(rideId, newStatus);
    loadRides(); // reload data
  };

  const handlePaymentChange = async (rideId, newStatus) => {
    await updatePaymentStatus(rideId, newStatus);
    loadRides(); // reload data
  };

  const handleDelete = async (rideId) => {
    await deleteRide(rideId);
    loadRides(); // reload data
  };

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
                <td>
                  Name: {ride.user?.fullName} <br />
                  Email: {ride.user?.email} <br />
                  Phone: {ride.user?.phone}
                </td>
                <td>₹{ride.advancePaid}</td>
                <td>
                  <select
                    value={ride.status}
                    onChange={(e) => handleStatusChange(ride.id, e.target.value)}
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
                    onChange={(e) => handlePaymentChange(ride.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(ride.id)}>Delete</button>
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

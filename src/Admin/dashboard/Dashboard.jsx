import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'; 
import './Dashboard.css';
import BlogList from '../blog/BlogList';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext';

const Dashboard = () => {
  const [visitCount, setVisitCount] = useState(123); // Placeholder for visit count
  const [tfnClicks, setTfnClicks] = useState(15); // Placeholder for TFN Clicks
  const navigate = useNavigate();  
  const { users, orders, blogs } = useAdminContext();



  return (
    <div className="dashboard-container">
      {/* Top Section - Stats in a row */}
      <div className="top-section">
        <div className="stat-item">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-item">
          <h3>Total Blogs</h3>
          <p>{blogs.length}</p>
        </div>
        <div className="stat-item">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        {/* <div className="stat-item">
          <h3>Total Blogs</h3>
          <p>{blogs.length}</p>
        </div> */}
      </div>

      {/* Bottom Section - Latest Blogs and Another Content */}
      <div className="bottom-section">
        <div className="left-part">
          <h3>Latest Blogs</h3>
          <div className="latest-blogs">
            <BlogList count={4} />
          </div>
        </div>
        <div className="right-part">
          {/* <h3>Admin Notifications</h3>
          <ul>
            <li>New user registration</li>
            <li>Payment pending</li>
            <li>Blog comments approval needed</li>
          </ul> */}
        </div>
      </div>

      {/* See More Button */}
      <button className="see-all-btn" onClick={() => navigate('/admin/blog')}>See All Blogs</button>
    </div>
  );
};

export default Dashboard;

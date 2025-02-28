import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Delete } from "../assets/Pictures";
import "../Styles/Users.css";
import axios from "../api/axios";
import Navbar from "./Navbar";
 
const Users = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("users"); // Add currentPage state
  const token = localStorage.getItem("authToken"); // Get token from localStorage

 
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark-mode");
    }
    fetchUsers();
  }, [token]); // Add token as a dependency in case it changes
 
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
 
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
 
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      setUsers(users.filter((user) => user.id !== userId)); // Remove deleted user from state
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUsernameClick = (userId) => {
    navigate(`/admin/user-profile/${userId}`);
  };

 
  return (
    <div>
            <Navbar currentPage={currentPage} />
 
    <div className={`users ${isDarkMode ? "dark-mode" : ""}`}>
      <h1>Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Phone Number</th>
              <th>Total Content Uploaded</th>
              <th>Total Content Rated</th>
              <th className="delete-users">Delete User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="users-username" onClick={() => handleUsernameClick(user.id)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {user.username}
                </td>
                <td>{user.phone_number}</td>
                <td>{user.total_uploads}</td>
                <td>{user.total_ratings}</td>
 
                <td>
                  <button className="delete" onClick={() => handleDelete(user.id)}>
                    <img src={Delete} alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};
 
export default Users;
 
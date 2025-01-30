import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Delete } from '../assets/Pictures';
import "../Styles/Users.css";

const Users = ({ isDarkMode }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
  }, []);
  const [users, setUsers] = useState([
    {
      User_Id: 1,
      Username: "Ram",
      Phone_Number: "9845454545",
      Joined_Date: "2022-01-01",
      Total_Uploads: 10,
    },
    {
      User_Id: 2,
      Username: "Shyam",
      Phone_Number: "97056566565",
      Joined_Date: "2022-02-01",
      Total_Uploads: 5,
    },
    {
      User_Id: 3,
      Username: "Hari",
      Phone_Number: "9805656565",
      Joined_Date: "2022-03-01",
      Total_Uploads: 15,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setUsers(users.filter(user => user.User_Id !== userId));
    }
  };

  return (
    <div className={`users ${isDarkMode ? 'dark-mode' : ''}`}>
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
              <th>Joined Date</th>
              <th>Total Uploads</th>
              <th className="delete-users">Delete Users</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.User_Id}>
                <td>{user.User_Id}</td>
                <td><a href="#">{user.Username}</a></td>
                <td>{user.Phone_Number}</td>
                <td>{user.Joined_Date}</td>
                <td>{user.Total_Uploads}</td>
                <td>
                  <button className="delete" onClick={() => handleDelete(user.User_Id)}>
                    <img src={Delete} alt="Delete"  />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
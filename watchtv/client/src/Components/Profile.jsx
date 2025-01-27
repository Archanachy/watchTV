import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { defaultAvatar } from "../assets/Pictures";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from "../api/axios";  // Make sure axios is correctly set up

const Profile = () => {
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location"); // Will now combine city and country
  const [bio, setBio] = useState("Biography");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Post");
  const [content, setContent] = useState([]);
  const navigate = useNavigate();

  // Fetch user profile and content data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Make sure to pass the token
          },
        });

        // const { profiles } = response.data;

        // Set the profile data from the response
        setUsername("Username");
        setBio("Biography");
        setAvatar(defaultAvatar);
        setRealName("Real Name");

        // Combine city and country into location
        const locationString = `${""}, ${""}`;
        setLocation(locationString.trim()); // Trim in case any values are missing

        // Set the content data (e.g., movies, posts)
        setContent([]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []); // This will run only once when the component mounts

  const handleEditClick = () => {
    navigate('/edit-profile'); // Navigate to the edit profile page
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-container">
      
      <div className="profile-about-container">
        <div className="profile-card">
          <div className="left-section">
            <div className="breadcrumb" ><span onClick={handleHome}>Home</span></div>
            <div className="avatar">
              <img src={avatar} alt="Avatar" className="avatar-image" />
            </div>
            <div className="real-name">{realName}</div>
          </div>
          <div className="right-section">
            <div className="profile-info-section">
              <div className="username-edit-container">
                <h2 className="username">{username}</h2>
                <button className="edit-button" onClick={handleEditClick}>
                  Edit Profile
                </button>
              </div>
              <p className="location">{location}</p> {/* Location will show city, country */}
              <p className="bio">{bio}</p>
            </div>
          </div>
        </div>

        <div className="stats">
          <div>
            <p>Joined on WatchTV</p>
            <p>{"Date"}</p>
          </div>
          <div>
            <p>Total Content Rated</p>
            <p>{0}</p>
          </div>
          <div>
            <p>Number of Ratings</p>
            <p>{0}</p>
          </div>
          <div>
            <p>Number of Uploads</p>
            <p>{0}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <a
          className={activeTab === "Post" ? "active-tab" : ""}
          onClick={() => setActiveTab("Post")}
        >
          Post
        </a>
        <a
          className={activeTab === "Content-Rated" ? "active-tab" : ""}
          onClick={() => setActiveTab("Content-Rated")}
        >
          Content Rated
        </a>
      </div>

      <div className="profile-View">
        {content.map((item, index) => (
          <div key={`${item.id}-${index}`} className="block">
            <img src={item.image_path} alt={item.title} className="block-image" />
            <div className="profile-block-details">
              <div className="profile-block-rating">
                <FontAwesomeIcon icon={faStar} className="profile-star-icon" />
                <span>{item.rating || "N/A"}</span>
                <div className="profile-block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
              </div>
              <div className="profile-block-name">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

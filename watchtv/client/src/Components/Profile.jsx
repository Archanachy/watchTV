import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { defaultAvatar } from "../assets/Pictures";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location");
  const [bio, setBio] = useState("Biography");
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Post");
  const [content, setContent] = useState([]); // State to hold content
  const navigate = useNavigate();

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleEditClick = () => {
    navigate('/edit-profile'); // Navigate to the new edit profile page
};
  const handleSaveClick = () => setIsEditing(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // Simulate fetching content
    const fetchContent = async () => {
      const simulatedContent = [
        {
          id: 1,
          title: "Sample Movie 1",
          rating: 4.5,
          released_date: "2023-01-01",
          image_path: "/path/to/image1.jpg"
        },
        {
          id: 2,
          title: "Sample Movie 2",
          rating: 3.8,
          released_date: "2023-02-01",
          image_path: "/path/to/image2.jpg"
        }
      ];
      setContent(simulatedContent);
    };
    fetchContent();
  }, []);

  return (
    <div className="profile-container">
      <div className="breadcrumb" ><span onClick={handleHome}>Home</span></div>
      <div className="profile-about-container">
        <div className="profile-card">
          <div className="left-section">
            <div className="avatar">
              <img src={avatar} alt="Avatar" className="avatar-image" />
              {/* <input
                // type="file"
                // accept="image/*"
                // onChange={handleAvatarChange}
                className="avatar-input"
              /> */}
            </div>
            <div className="real-name">{realName}</div>
          </div>
          <div className="right-section">
            {/* {isEditing ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter Bio"
                />
                <button onClick={handleSaveClick}>Save</button>
              </div>
            ) : ( )}*/}
              <div className="info-section">
                <div className="username-edit-container">
                  <h2 className="username">{username}</h2>
                  <button className="edit-button" onClick={handleEditClick}>
                    Edit Profile
                  </button>
                </div>
                <p className="location">{location}</p>
                <p className="bio">{bio}</p>
              </div>
            
          </div>
        </div>
        <div className="stats">
          <div>
            <p>Joined on WatchTV</p>
            <p>Date</p>
          </div>
          <div>
            <p>Total Content Rated</p>
            <p>12</p>
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
          className={activeTab === "Watchlist" ? "active-tab" : ""}
          onClick={() => setActiveTab("Watchlist")}
        >
          Watchlist
        </a>
      </div>

      <div className="View">
        {content.map((item, index) => (
          <div key={`${item.id}-${index}`} className="block">
            <img src={item.image_path} alt={item.title} className="block-image" />
            <div className="block-details">
              <div className="block-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>{item.rating || "N/A"}</span>
                <div className="block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
              </div>
              <div className="block-name">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
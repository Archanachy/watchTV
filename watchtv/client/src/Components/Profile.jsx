import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { defaultAvatar } from "../assets/Pictures";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';

const Profile = () => {
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location");
  const [bio, setBio] = useState("Biography");
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Post");
  const [dateJoined, setDateJoined] = useState("Date");
  const [content, setContent] = useState([]); // State to hold content
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the token is sent for authentication
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Send token for authentication
            "Content-Type": "application/json"
          }
        });
  
        const profile = response.data.profile;
  
        setUsername(profile.username || "Username");
        setRealName(profile.fullname || "Real Name");
        setLocation(`${profile.city || "City"}, ${profile.country || "Country"}`);
        setBio(profile.bio || "Biography");
        setDateJoined(new Date(profile.created_at).toISOString().split('T')[0]);
        setAvatar(profile.image_path ? `${import.meta.env.VITE_API_URL}${profile.image_path}` : defaultAvatar);


        console.log(`${import.meta.env.VITE_API_URL}${profile.image_path}`);
        console.log(profile.image_path); // Check if it's correct or undefined
    



        
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, []);
  
  

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
                <p className="location">{location}</p>
                <p className="bio">{bio}</p>
              </div>
            
          </div>
        </div>
        <div className="stats">
          <div>
            <p>Joined on WatchTV</p>
            <p>{dateJoined}</p>
          </div>
          <div>
            <p>Total Content Rated</p>
            <p>{0}</p>
          </div>
          <div>
            <p>Number of Ratings</p>
            <p>0</p>
          </div>
          <div>
            <p>Number of Uploads</p>
            <p>0</p>
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
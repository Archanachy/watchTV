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
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Post");
  const [dateJoined, setDateJoined] = useState("Date");
  const [content, setContent] = useState([]); // State to hold content
  const [totalUpload, setTotalUpload] = useState(0); // State to hold total uploads
  const [ratedContent, setRatedContent] = useState([]); // State to hold rated content
  const [totalRated, setTotalRated] = useState(0); // State for total rated content

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`, 
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
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRatedContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content-rated`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        setRatedContent(response.data.contentRated);
        setTotalRated(response.data.totalRated); // Store the count
      } catch (error) {
        console.error("Error fetching rated content:", error);
      }
    };
  
    fetchRatedContent();
  }, []);

  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  useEffect(() => {
    const fetchTotalUpload = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/totalUpload`, {
            headers: {
              "Authorization": `Bearer ${token}`, 
              "Content-Type": "application/json"
            }
          });

          const totalUpload = response.data.totalUpload;

          setTotalUpload(totalUpload);
      } catch (error) {
        console.error("Error fetching total upload:", error);
      }
    };
    fetchTotalUpload();
  }, []); 

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`, {
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          }
        });

        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
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
            <p>{totalRated}</p>
          </div>
          <div>
            <p>Number of Ratings</p>
            <p>0</p>
          </div>
          <div>
            <p>Total Content Uploaded</p>
            <p>{totalUpload}</p>
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
          {activeTab === "Post" && (
            content.length > 0 ? (
              content.map((item, index) => (
                <div key={`${item.id}-${index}`} className="block" onClick={() => handleContentClick(item.content_id)}>
                  <img src={`${import.meta.env.VITE_API_URL}${item.image_path}`} alt={item.title} className="block-image" />
                  <div className="profile-block-details">
                    <div className="profile-block-rating">
                      <FontAwesomeIcon icon={faStar} className="profile-star-icon" />
                      <span>{item.rating || "N/A"}</span>
                      <div className="profile-block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
                    </div>
                    <div className="profile-block-name">{item.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <p >No content uploaded yet!</p>
            )
          )}

        {activeTab === "Content-Rated" && (
          ratedContent.length > 0 ? (
            ratedContent.map((item, index) => (
              <div key={`${item.id}-${index}`} className="block" onClick={() => handleContentClick(item.content_id)}>
                <img src={`${import.meta.env.VITE_API_URL}${item.image_path}`} alt={item.title} className="block-image" />
                <div className="profile-block-details">
                  <div className="profile-block-rating">
                    <FontAwesomeIcon icon={faStar} className="profile-star-icon" />
                    <span>{item.rating || "N/A"}</span>
                    <div className="profile-block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
                  </div>
                  <div className="profile-block-name">{item.title}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No content rated yet.</p>
          )
        )}

      </div>

    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/Profile.css";
import { defaultAvatar } from "../assets/Pictures";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';

const AdminUserProfile = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location");
  const [bio, setBio] = useState("Biography");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Post");
  const [dateJoined, setDateJoined] = useState("Date");
  const [content, setContent] = useState([]); 
  const [totalUpload, setTotalUpload] = useState(0); 
  const [ratedContent, setRatedContent] = useState([]); 
  const [totalRated, setTotalRated] = useState(0); 
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

   
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/user-profile/${userId}`, {
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
        setError("Failed to load profile");
      }
    };

    if (token && userId) {
      fetchProfile();
    }
  }, [userId, token]);

  // Fetch rated content
  useEffect(() => {
    const fetchRatedContent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/content-rated/${userId}`, {   
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        setRatedContent(response.data.contentRated);
        setTotalRated(response.data.totalRated);
      } catch (error) {
        console.error("Error fetching rated content:", error);
      }
    };
  
    if (token && userId) {
      fetchRatedContent();
    }
  }, [userId, token]);

  // Fetch total uploads and content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/post/${userId}`, {
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

    const fetchTotalUpload = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/totalUpload/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        setTotalUpload(response.data.totalUpload);

        // Fetch content only if the user has uploaded content
        if (response.data.totalUpload > 0) {
          fetchContent();
        }
      } catch (error) {
        console.error("Error fetching total upload:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchTotalUpload();
    }
  }, [userId, token]);

  // Dark mode effect
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleHome = () => {
    navigate('/dashboard');
  };

  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container">Error: {error}</div>;
  }

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
                    <span>{Number(item.average_rating) > 0 ? Number(item.average_rating).toFixed(1) : "N/A"}</span>
                    <div className="profile-block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
                  </div>
                  <div className="profile-block-name">{item.title}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No content uploaded yet!</p>
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

export default AdminUserProfile;
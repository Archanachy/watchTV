import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Edit-Profile.css';
import axios from '../api/axios';

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States for image and cropping
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  // States for profile details
  const [realName, setRealName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user's profile
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const profile = response.data.profile;
      setRealName(profile.fullname || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setBio(profile.bio || '');
      setBioCount(profile.bio ? profile.bio.length : 0);
      setExistingImage(profile.image_path
        ? `${import.meta.env.VITE_API_URL}${profile.image_path}`
        : null
      );
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    fetchProfile();
  }, [fetchProfile]);

  // Handle file selection and preview
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cropper callbacks
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const removeImage = () => {
    setImage(null);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    setBioCount(e.target.value.length);
  };

  // Handle profile update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('fullname', realName || '');
      formData.append('city', city || '');
      formData.append('country', country || '');
      formData.append('bio', bio || '');

      // Append image if a new one has been selected
      if (selectedFile) {
        formData.append('profileAvatar', selectedFile);
      }

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProfile();
      alert('Profile updated successfully!');
      navigate('/profile'); 
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
  
        // Call API to delete the user account
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/deleteAccount`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        // Clear local storage and navigate
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
  
        alert('Your account has been deleted.');
        navigate('/signup'); // Redirect to signup or homepage
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete your account. Please try again.');
      }
    }
  };
  

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-form-container">
        <div className="edit-profile-header-container">
          <h1>Edit Profile</h1>
        </div>

        {/* Circular Container for the Image */}
        <div className="edit-profile-image-container">
          {image ? (
            // Show Cropper if a new image is selected
            <div className="profile-crop-container">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                // 1:1 aspect for a circular display
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <button className="remove-profile-image-button" onClick={removeImage}>
                ✖
              </button>
            </div>
          ) : existingImage ? (
            <div className="existing-profile-image">
              <img src={existingImage} alt="Profile" />
              <button
                className="remove-profile-image-button"
                onClick={() => setExistingImage(null)}
              >
                ✖
              </button>
            </div>
          ) : (
            // Fallback if no image
            <button onClick={handleFileUpload} className="upload-placeholder-circle">
              Upload Image
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </button>
          )}
        </div>

        {/* Profile Fields */}
        <div className="edit-profile-details-container">
          <label>
            <span className="profile-box-label">Full Name:</span>
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
          </label>
          <label>
            <span className="profile-box-label">City:</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            <span className="profile-box-label">Country:</span>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            <span className="profile-box-label">Bio:</span>
            <textarea
              maxLength={500}
              value={bio}
              onChange={handleBioChange}
            />
            <div className="profile-bio-count">{bioCount}/500</div>
          </label>
        </div>

        {/* Controls */}
        <div className="edit-profile-controls-container">
          <button id="profile-update" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button id='profile-delete' onClick={handleDelete}>
            Delete Me
          </button>
          <button id="profile-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;

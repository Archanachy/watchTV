import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Edit-Profile.css';
import axios from '../api/axios';

function EditProfile() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [realName, setRealName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const fileInputRef = useRef(null);
    const [bioCount, setBioCount] = useState(0);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch the current user profile when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const profile = response.data;

                setRealName(profile.fullname || '');
                setCountry(profile.country || '');
                setCity(profile.city || '');
                setBio(profile.bio || '');
                setBioCount(profile.bio ? profile.bio.length : 0);
                setExistingImage(profile.image_path || null); // Set existing image
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        const darkMode = localStorage.getItem("darkMode") === "true";
        if (darkMode) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Store file for upload
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Display preview
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const removeImage =() => {
        setImage(null);
    }

    const handleBioChange = (e) => {
        setBio(e.target.value);
        setBioCount(e.target.value.length);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            navigate('/login');
        } else {
            // Do nothing if the user cancels the deletion
        }
    }

    const handleUpdate = async () => {
        setLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('fullname', realName || '');
            formData.append('city', city || '');
            formData.append('country', country || '');
            formData.append('bio', bio || '');

            if (selectedFile) {
                formData.append('profileAvatar', selectedFile);
            }            

            await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            });

            navigate('/profile'); // Navigate back to profile after update
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-form-container">
                <div className="edit-profile-header-container">
                    <h1>Edit Profile</h1>
                </div>
                <div className="edit-profile-image-container" >
                    {image ? (
                        <div className="profile-crop-container">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{ containerStyle: { width: '100%', height: '100%' } }}
                            />
                            <button className="remove-profile-image-button" onClick={removeImage}>
                               <span>✖</span> 
                            </button>
                        </div>
                    ) : existingImage ? (
                            <div className="existing-profile-image">
                                <img src={existingImage} alt="Profile" />
                                <button className="remove-profile-image-button" onClick={() => setExistingImage(null)}>
                                    <span>✖</span>
                                </button>
                            </div>
                    ) : (
                        <button onClick={handleFileUpload}>
                            <span >Upload Image</span>
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
                <div className="edit-profile-details-container">
                    <label>
                        <span className="profile-box-label">Full Name:</span>
                        <input type="text" value={realName} onChange={(e) => setRealName(e.target.value)} />
                    </label>
                    <label>
                        <span className="profile-box-label">City:</span>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label>
                        <span className="profile-box-label">Country:</span>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </label>
                    <label>
                        <span className="profile-box-label">Bio:</span>
                        <textarea  
                        maxLength={500}
                        value={bio}
                        onChange={handleBioChange}
                         />
                    </label>
                    <div className='profile-bio-count'>{bioCount}/500</div>
                </div>
                <div className="edit-profile-controls-container">
                    <button id="profile-update" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button id="profile-delete" onClick={handleDelete}>
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
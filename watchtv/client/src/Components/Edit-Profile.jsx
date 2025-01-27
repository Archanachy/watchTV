import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Edit-Profile.css';
import axios from '../api/axios';

function EditProfile() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [realName, setRealName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const fileInputRef = useRef(null);
    const [bioCount, setBioCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleUpdate = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const formData = new FormData();
            const userId = localStorage.getItem('userId');
            formData.append('userId', userId);
            formData.append('fullname', realName);
            formData.append('country', country);
            formData.append('city', city);
            formData.append('bio', bio);

             // If an image is uploaded, add it to the formData
             if (image) {
                const croppedImageBlob = await getCroppedImageBlob(image, croppedArea);
                formData.append('profileAvatar', croppedImageBlob);
            }


            // Send the PATCH request
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token for authentication
                    },
                }
            );

            console.log('Profile updated:', response.data);
            alert('Profile updated successfully');
            navigate('/profile'); // Redirect to the profile page
        } catch (error) {
            console.error('Error updating profile', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Display server error message
            } else {
                alert('An error occurred while updating profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    // Helper function to crop the image based on the cropped area
    const getCroppedImageBlob = (imageSrc, croppedAreaPixels) => {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = croppedAreaPixels.width;
                canvas.height = croppedAreaPixels.height;

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                );

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg');
            };
        });
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-form-container">
                <div className="edit-profile-header-container">
                    <h1>Edit Profile</h1>
                </div>
                <div className="edit-profile-image-container">
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
                    ) : (
                        <button onClick={handleFileUpload}>
                            <span>Upload Image</span>
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
                    <div className="profile-bio-count">{bioCount}/500</div>
                </div>
                <div className="edit-profile-controls-container">
                    <button id="update" onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button id="cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;

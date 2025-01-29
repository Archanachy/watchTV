import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import '../Styles/Edit-Profile.css';

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

    const removeImage =() => {
        setImage(null);
    }

    const handleBioChange = (e) => {
        setBio(e.target.value);
        setBioCount(e.target.value.length);
    };

    const handleUpdate = () => {
        // Save profile changes logic here
        navigate('/profile');
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
                    <button id="update" onClick={handleUpdate}>
                        Update
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
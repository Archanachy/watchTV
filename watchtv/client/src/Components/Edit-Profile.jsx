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

    const handleSave = () => {
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
                <div className="edit-profile-image-container" onClick={handleFileUpload}>
                    {image ? (
                        <div className="crop-container">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    ) : (
                        <button>
                            <span onChange={handleImageChange}>Upload Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                
                            />
                        </button>
                    )}
                </div>
                <div className="edit-profile-details-container">
                    <label>
                        <span className="box-label">Full Name:</span>
                        <input type="text" value={realName} onChange={(e) => setRealName(e.target.value)} />
                    </label>
                    <label>
                        <span className="box-label">Country:</span>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </label>
                    <label>
                        <span className="box-label">City:</span>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label>
                        <span className="box-label">Bio:</span>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                    </label>
                </div>
                <div className="edit-profile-controls-container">
                    <button id="save" onClick={handleSave}>
                        Save
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
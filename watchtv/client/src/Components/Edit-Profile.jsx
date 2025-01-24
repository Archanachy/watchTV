import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Edit-Profile.css';

function EditProfile() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [realName, setRealName] = useState('');
    const [location, setLocation] = useState('');
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
        // For example, you can update the profile state in a global store or make an API call
        // After saving, navigate back to the profile page
        navigate('/profile');
    };

    const handleCancel = () => {
        navigate('/profile'); // Navigate back to profile page
    };

    return (
        <div className="edit-profile-container">
            <div className="upload-container">
                <input type="file" onChange={handleImageChange} style={{ display: 'none' }} ref={fileInputRef} />
                <button onClick={handleFileUpload}>Upload Image</button>
                {image && (
                    <div className="crop-container">
                        {/* Crop component logic here */}
                    </div>
                )}
            </div>
            <div className="upload-details-container">
                <input type="text" value={realName} onChange={(e) => setRealName(e.target.value)} placeholder="Real Name" />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"></textarea>
                <div className="upload-controls-container">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;